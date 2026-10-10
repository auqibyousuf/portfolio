export type Pose =
  | "stand" | "point-right" | "point-left" | "think" | "code" | "celebrate" | "thumbs-up" | "present" | "sit";

// Poses share one vertical scale (head to feet is 900px in every file) and are trimmed to their own width, so size
// them by height and they keep identical proportions.
const DIMS: Record<Pose, [number, number]> = {
  stand: [306, 900],
  celebrate: [615, 900],
  code: [427, 900],
  "point-left": [430, 900],
  "point-right": [407, 900],
  present: [594, 900],
  sit: [413, 900],
  think: [300, 900],
  "thumbs-up": [330, 900],
};

/** Transparent 3D character render. `priority` loads it eagerly for above-the-fold use. */
export function Character({ pose = "stand", className = "", title, priority = false }: { pose?: Pose; className?: string; title?: string; priority?: boolean }) {
  const [width, height] = DIMS[pose];
  return (
    <img
      src={`/images/characters/${pose}.webp`}
      width={width}
      height={height}
      alt={title ?? ""}
      aria-hidden={title ? undefined : true}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      {...(priority ? { fetchPriority: "high" as const } : {})}
      draggable={false}
      className={className}
    />
  );
}

/** Head-and-shoulders crop of the character in a circle, for the navbar and hero greeting. */
export function Avatar({ size = 56, className = "" }: { size?: number; className?: string }) {
  return (
    <span
      className={`relative inline-block shrink-0 overflow-hidden rounded-full border-2 border-white bg-gradient-to-br from-accent/15 to-soft shadow-card ${className}`}
      style={{ width: size, height: size }}
    >
      <img src="/images/characters/avatar.webp" width={360} height={360} alt="" loading="lazy" decoding="async" draggable={false} className="h-full w-full object-cover" />
    </span>
  );
}
