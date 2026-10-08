/** Mutable scroll state shared between the DOM and the WebGL scene (read every frame, never rendered). */
export const GAP = 36; // world units between consecutive stage sets

export const SECTION_IDS = ["hero", "works", "architecture", "skills", "experience", "certifications", "contact"] as const;

export const world = {
  t: 0, // damped stage position (0 = hero, 1 = works, ...)
  target: 0, // stage position derived from scroll
  vel: 0, // damped stage velocity, used to spin things on fast scrolls
  worksActive: 0, // float index of the focused project card
};
