import { useId } from "react";
import { SITE } from "../data/site";

export type Pose =
  | "stand" | "point-right" | "point-left" | "think" | "code" | "celebrate" | "thumbs-up" | "present" | "sit";

type P = [number, number];
type Arms = { l: [P, P]; r: [P, P] };

/** Elbow then hand position for each arm, in the 400x600 character space. */
const ARMS: Record<Exclude<Pose, "point-left">, Arms> = {
  stand: { l: [[116, 300], [120, 374]], r: [[284, 300], [280, 374]] },
  "point-right": { l: [[116, 300], [120, 374]], r: [[304, 262], [366, 244]] },
  think: { l: [[130, 322], [240, 318]], r: [[294, 302], [228, 206]] },
  code: { l: [[112, 314], [160, 398]], r: [[288, 314], [240, 398]] },
  celebrate: { l: [[94, 200], [82, 126]], r: [[306, 200], [318, 126]] },
  "thumbs-up": { l: [[116, 300], [120, 374]], r: [[304, 294], [320, 240]] },
  present: { l: [[92, 288], [44, 310]], r: [[308, 288], [356, 310]] },
  sit: { l: [[118, 312], [152, 428]], r: [[282, 312], [248, 428]] },
};

const SHOULDER = { l: [148, 240] as P, r: [252, 240] as P };

function Defs({ id }: { id: string }) {
  return (
    <defs>
      <radialGradient id={`${id}-skin`} cx="40%" cy="32%" r="75%">
        <stop offset="0" stopColor="#F6D2B0" />
        <stop offset="1" stopColor="#DFA77C" />
      </radialGradient>
      <linearGradient id={`${id}-hair`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#2B303B" />
        <stop offset="1" stopColor="#12151B" />
      </linearGradient>
      <linearGradient id={`${id}-jacket`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#2A303B" />
        <stop offset="1" stopColor="#151922" />
      </linearGradient>
      <linearGradient id={`${id}-tee`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#E23A50" />
        <stop offset="1" stopColor="#B91E34" />
      </linearGradient>
      <linearGradient id={`${id}-pants`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#3A4152" />
        <stop offset="1" stopColor="#222735" />
      </linearGradient>
      <radialGradient id={`${id}-shine`} cx="30%" cy="20%" r="60%">
        <stop offset="0" stopColor="#fff" stopOpacity="0.45" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </radialGradient>
      <filter id={`${id}-soft`} x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="10" stdDeviation="10" floodColor="#0F1218" floodOpacity="0.18" />
      </filter>
    </defs>
  );
}

function Head({ id, open = false }: { id: string; open?: boolean }) {
  return (
    <g>
      <rect x="184" y="186" width="32" height="44" rx="14" fill="#D49C72" />
      <circle cx="134" cy="146" r="14" fill={`url(#${id}-skin)`} />
      <circle cx="266" cy="146" r="14" fill={`url(#${id}-skin)`} />
      <circle cx="200" cy="140" r="68" fill={`url(#${id}-skin)`} />
      <circle cx="200" cy="140" r="68" fill={`url(#${id}-shine)`} />
      {/* hair */}
      <path d="M132 132C128 76 170 54 206 56c42 2 68 32 62 76-14-22-38-32-68-32s-50 10-68 32Z" fill={`url(#${id}-hair)`} />
      <path d="M170 64c10-12 34-14 50-6-14 0-30 6-40 18-4-6-8-10-10-12Z" fill="#3A4150" opacity="0.55" />
      {/* brows */}
      <path d="M160 120q16-10 34-2" stroke="#1B1F27" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M206 118q18-8 34 2" stroke="#1B1F27" strokeWidth="5" strokeLinecap="round" fill="none" />
      {/* eyes */}
      <ellipse cx="176" cy="146" rx="11" ry="13" fill="#fff" />
      <ellipse cx="224" cy="146" rx="11" ry="13" fill="#fff" />
      <circle cx="178" cy="148" r="7" fill="#1B1F27" />
      <circle cx="226" cy="148" r="7" fill="#1B1F27" />
      <circle cx="180" cy="145" r="2.4" fill="#fff" />
      <circle cx="228" cy="145" r="2.4" fill="#fff" />
      {/* glasses */}
      <g fill="#fff" fillOpacity="0.14" stroke="#1B1F27" strokeWidth="4">
        <rect x="154" y="128" width="46" height="36" rx="15" />
        <rect x="200" y="128" width="46" height="36" rx="15" />
      </g>
      <path d="M198 144h4" stroke="#1B1F27" strokeWidth="4" strokeLinecap="round" />
      {/* cheeks and mouth */}
      <ellipse cx="160" cy="176" rx="12" ry="7" fill="#E5695F" opacity="0.22" />
      <ellipse cx="240" cy="176" rx="12" ry="7" fill="#E5695F" opacity="0.22" />
      {open ? (
        <path d="M182 176q18 26 36 0Z" fill="#7A1B2A" stroke="#1B1F27" strokeWidth="3" strokeLinejoin="round" />
      ) : (
        <path d="M182 178q18 16 36 0" stroke="#1B1F27" strokeWidth="4.5" strokeLinecap="round" fill="none" />
      )}
    </g>
  );
}

function Arm({ id, side, elbow, hand }: { id: string; side: "l" | "r"; elbow: P; hand: P }) {
  const [sx, sy] = SHOULDER[side];
  return (
    <g>
      <path d={`M${sx} ${sy} Q${elbow[0]} ${elbow[1]} ${hand[0]} ${hand[1]}`} fill="none" stroke={`url(#${id}-jacket)`} strokeWidth="38" strokeLinecap="round" />
      <circle cx={hand[0]} cy={hand[1]} r="19" fill={`url(#${id}-skin)`} />
    </g>
  );
}

/** Original, friendly "clay" character used throughout the page. The same figure is reposed, never redrawn. */
export function Character({ pose = "stand", className = "", title }: { pose?: Pose; className?: string; title?: string }) {
  const uid = useId().replace(/:/g, "");
  const override = SITE.characters[pose];
  if (override) {
    return <img src={override} alt={title ?? ""} loading="lazy" decoding="async" className={className} />;
  }

  const mirrored = pose === "point-left";
  const key = (mirrored ? "point-right" : pose) as Exclude<Pose, "point-left">;
  const arms = ARMS[key];
  const seated = key === "sit" || key === "code";
  const legEnd = seated ? 474 : 562;

  return (
    <svg
      viewBox="20 30 380 570"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <Defs id={uid} />
      <g transform={mirrored ? "translate(420 0) scale(-1 1)" : undefined}>
        <ellipse cx="200" cy="574" rx="104" ry="14" fill="#0F1218" opacity="0.1" />
        <g filter={`url(#${uid}-soft)`}>
          {seated && <rect x="116" y="400" width="168" height="76" rx="22" fill="#fff" stroke="#E2E4E9" />}
          {/* legs */}
          <rect x="156" y="366" width="42" height={legEnd - 366} rx="21" fill={`url(#${uid}-pants)`} />
          <rect x="202" y="366" width="42" height={legEnd - 366} rx="21" fill={`url(#${uid}-pants)`} />
          <ellipse cx="176" cy={legEnd + 6} rx="36" ry="17" fill="#F4F5F7" stroke="#D9DCE3" strokeWidth="2" />
          <ellipse cx="224" cy={legEnd + 6} rx="36" ry="17" fill="#F4F5F7" stroke="#D9DCE3" strokeWidth="2" />
          {/* torso */}
          <rect x="136" y="208" width="128" height="176" rx="48" fill={`url(#${uid}-jacket)`} />
          <path d="M176 214h48l-6 70h-36Z" fill={`url(#${uid}-tee)`} />
          <path d="M200 252v128" stroke="#0B0D12" strokeOpacity="0.45" strokeWidth="2" />
          <circle cx="200" cy="232" r="3" fill="#fff" opacity="0.7" />
        </g>

        <Arm id={uid} side="l" elbow={arms.l[0]} hand={arms.l[1]} />
        <Arm id={uid} side="r" elbow={arms.r[0]} hand={arms.r[1]} />

        {key === "point-right" && <rect x="360" y="236" width="34" height="14" rx="7" fill={`url(#${uid}-skin)`} />}
        {key === "thumbs-up" && <rect x="312" y="206" width="16" height="36" rx="8" fill={`url(#${uid}-skin)`} />}
        {key === "present" && (
          <>
            <ellipse cx="44" cy="304" rx="12" ry="20" fill={`url(#${uid}-skin)`} />
            <ellipse cx="356" cy="304" rx="12" ry="20" fill={`url(#${uid}-skin)`} />
          </>
        )}

        <Head id={uid} open={key === "celebrate" || key === "present"} />

        {key === "think" && (
          <g fill="#fff" stroke="#D9DCE3">
            <circle cx="296" cy="84" r="7" />
            <circle cx="318" cy="58" r="11" />
            <circle cx="350" cy="30" r="17" />
          </g>
        )}
        {key === "code" && (
          <g>
            <rect x="136" y="318" width="128" height="82" rx="12" fill="#ECEEF2" stroke="#CDD1D9" strokeWidth="2" />
            <circle cx="200" cy="359" r="9" fill="#D4223A" />
            <rect x="124" y="398" width="152" height="14" rx="7" fill="#D5D9E0" />
          </g>
        )}
        {key === "celebrate" &&
          [
            [60, 90, "#D4223A"], [340, 70, "#0F1218"], [30, 200, "#D4223A"], [372, 190, "#0F1218"], [110, 44, "#fff"], [290, 40, "#D4223A"], [336, 130, "#fff"],
          ].map(([x, y, c], i) => (
            <rect key={i} className="confetti" style={{ animationDelay: `${i * 0.35}s` }} x={x as number} y={y as number} width="12" height="12" rx="3" fill={c as string} stroke="#D9DCE3" />
          ))}
      </g>
    </svg>
  );
}

/** The character's head and shoulders in a circle. Uses the profile photo when one is configured. */
export function Avatar({ size = 56, className = "" }: { size?: number; className?: string }) {
  const uid = useId().replace(/:/g, "");
  return (
    <span
      className={`relative inline-block shrink-0 overflow-hidden rounded-full border-2 border-white bg-gradient-to-br from-accent/15 to-soft shadow-card ${className}`}
      style={{ width: size, height: size }}
    >
      {SITE.photo ? (
        <img src={SITE.photo} alt="" loading="lazy" className="h-full w-full object-cover" />
      ) : (
        <svg viewBox="96 40 208 210" className="h-full w-full" aria-hidden="true" focusable="false">
          <Defs id={uid} />
          <rect x="136" y="208" width="128" height="120" rx="48" fill={`url(#${uid}-jacket)`} />
          <path d="M176 214h48l-6 40h-36Z" fill={`url(#${uid}-tee)`} />
          <Head id={uid} />
        </svg>
      )}
    </span>
  );
}
