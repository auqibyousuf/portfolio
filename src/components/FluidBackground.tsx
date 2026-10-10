import { useEffect, useRef } from "react";

const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;

// Domain-warped simplex noise mapped through a rainbow palette, with dark voids between the ribbons so it reads
// as liquid. Recent cursor positions bend the field and add a glow, so the liquid follows the pointer.
const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uSpeed;
uniform vec2 uTrail[10];

vec3 mod289(vec3 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
vec2 mod289(vec2 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
vec3 permute(vec3 x){ return mod289(((x*34.0)+1.0)*x); }
float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz; x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m; m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g; g.x = a0.x * x0.x + h.x * x0.y; g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
vec3 palette(float t){ return 0.5 + 0.5 * cos(6.28318 * (t + vec3(0.0, 0.33, 0.67))); }

void main(){
  float aspect = uRes.x / uRes.y;
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0) * 1.7;

  // The recent cursor trail bulges the liquid outwards and, the faster you move, swirls it around the cursor.
  vec2 disp = vec2(0.0);
  for (int i = 0; i < 10; i++) {
    vec2 m = (uTrail[i] - 0.5) * vec2(aspect, 1.0) * 1.7;
    vec2 d = p - m;
    float w = exp(-dot(d, d) * 2.6) * (1.0 - float(i) / 10.0);
    disp += d * w * 0.9 + vec2(-d.y, d.x) * w * (0.35 + uSpeed * 2.2);
  }
  p += disp;

  float t = uTime * 0.07;
  vec2 q = vec2(snoise(p + vec2(0.0, t)), snoise(p + vec2(5.2, 1.3) - t));
  vec2 r = vec2(snoise(p + 2.0 * q + vec2(1.7, 9.2) + t * 1.3), snoise(p + 2.0 * q + vec2(8.3, 2.8) - t));
  float f = snoise(p + 2.4 * r) * 0.5 + 0.5;

  vec3 col = palette(f * 1.1 + length(q) * 0.4 + uTime * 0.015);
  float body = smoothstep(0.3, 0.8, f);
  float rim = pow(clamp(abs(r.x), 0.0, 1.0), 3.0);
  col = col * body * 0.5 + rim * 0.12;

  // Rainbow comet along the cursor trail and a radial rainbow halo on the cursor. max() keeps colours distinct
  // where they overlap; summing them would wash out to white.
  vec3 comet = vec3(0.0);
  for (int i = 0; i < 10; i++) {
    vec2 dm = (uv - uTrail[i]) * vec2(aspect, 1.0);
    float k = exp(-dot(dm, dm) * (70.0 - float(i) * 4.0)) * (1.0 - float(i) / 10.0);
    comet = max(comet, palette(uTime * 0.08 + float(i) * 0.12) * k);
  }
  vec2 dh = (uv - uMouse) * vec2(aspect, 1.0);
  float rad = length(dh);
  comet = max(comet, palette(rad * 3.5 - uTime * 0.25) * exp(-rad * rad * 10.0) * 0.85);
  col += pow(comet, vec3(1.25)) * (0.6 + uSpeed * 1.4);

  float vig = smoothstep(1.25, 0.25, length((uv - 0.5) * vec2(aspect, 1.0)));
  col *= mix(0.55, 1.0, vig);
  gl_FragColor = vec4(col, 1.0);
}`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? "shader compile failed");
  return s;
}

/**
 * Full-page rainbow liquid that flows and bends around the cursor. Rendered at reduced resolution, blended with
 * `screen` so its dark voids vanish into the page colour, and paused when the tab is hidden.
 */
export function FluidBackground() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const gl = el.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
    if (!gl) return;

    let program: WebGLProgram;
    try {
      program = gl.createProgram()!;
      gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERT));
      gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error("link failed");
    } catch {
      return; // purely decorative: fail quietly
    }
    gl.useProgram(program);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const u = {
      res: gl.getUniformLocation(program, "uRes"),
      time: gl.getUniformLocation(program, "uTime"),
      mouse: gl.getUniformLocation(program, "uMouse"),
      speed: gl.getUniformLocation(program, "uSpeed"),
      trail: gl.getUniformLocation(program, "uTrail"),
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const SCALE = 0.45;
    const resize = () => {
      el.width = Math.max(2, Math.round(window.innerWidth * SCALE));
      el.height = Math.max(2, Math.round(window.innerHeight * SCALE));
      gl.viewport(0, 0, el.width, el.height);
      gl.uniform2f(u.res, el.width, el.height);
    };
    resize();
    window.addEventListener("resize", resize);

    // Pointer state. Without recent pointer movement (touch devices, idle) the glow wanders on its own.
    const target = { x: 0.5, y: 0.5 };
    const pos = { x: 0.5, y: 0.5 };
    let lastMove = -1e9;
    let speed = 0;
    const onMove = (e: PointerEvent) => {
      target.x = e.clientX / window.innerWidth;
      target.y = 1 - e.clientY / window.innerHeight;
      lastMove = performance.now();
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const trail = new Float32Array(20);
    for (let i = 0; i < 10; i++) {
      trail[i * 2] = 0.5;
      trail[i * 2 + 1] = 0.5;
    }

    let raf = 0;
    let running = true;
    let lastShift = 0;
    const start = performance.now();
    const frame = (now: number) => {
      const t = (now - start) / 1000;
      if (now - lastMove > 2500) {
        target.x = 0.5 + 0.32 * Math.sin(t * 0.31);
        target.y = 0.5 + 0.26 * Math.cos(t * 0.23);
      }
      const px = pos.x;
      const py = pos.y;
      pos.x += (target.x - pos.x) * 0.08;
      pos.y += (target.y - pos.y) * 0.08;
      speed += (Math.min(1, Math.hypot(pos.x - px, pos.y - py) * 90) - speed) * 0.12;
      // Shift the trail every few frames so older points lag behind the cursor.
      if (now - lastShift > 45) {
        trail.copyWithin(2, 0, 18);
        lastShift = now;
      }
      trail[0] = pos.x;
      trail[1] = pos.y;
      gl.uniform1f(u.time, t);
      gl.uniform2f(u.mouse, pos.x, pos.y);
      gl.uniform1f(u.speed, speed);
      gl.uniform2fv(u.trail, trail);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (running && !reduced) raf = requestAnimationFrame(frame);
    };

    const onVisibility = () => {
      running = !document.hidden;
      cancelAnimationFrame(raf);
      if (running && !reduced) raf = requestAnimationFrame(frame);
    };
    document.addEventListener("visibilitychange", onVisibility);
    raf = requestAnimationFrame(frame);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return (
    <canvas
      ref={canvas}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-20 h-full w-full opacity-[0.6] mix-blend-screen"
    />
  );
}
