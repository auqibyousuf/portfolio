# Portfolio — Auqib Yousuf Ahangar

A light, editorial portfolio built from the *Master Portfolio Building Prompt Guide*: React 19, TypeScript, Vite,
Tailwind CSS, GSAP (ScrollTrigger) and Framer Motion.

```bash
npm install
npm run dev      # local dev server
npm run build    # type-check + production build
npm run lint
```

## Structure

| # | Section | Notes |
| --- | --- | --- |
| 01 | Preloader | Framer Motion boot sequence, bubbles, monogram, signature title, percentage, upward exit |
| 02 | Hero | GSAP entrance, mouse parallax, oversized background word, magnetic CTAs, dual skills marquee |
| 03 | About | GSAP ScrollTrigger reveals, editable facts, floating character |
| 04 | Experience | Pinned card deck on desktop (plain list on small screens), alternating neutral and accent cards |
| 05 | Projects | Streaming-style snap rail, ticker banner, case-study dialog |
| 06 | Skills | Bento grid with category tabs and an active spotlight |
| 07 | Achievements | Result cards, accent feature card, certifications |
| 08 | Contact | Validated, accessible form with loading, success and error states |
| 09 | Footer | Status ticker, focus areas, large name treatment |

## Background, cursor and themes

- `MeshBackground.tsx`: a full-page dot mesh on a canvas. It breathes with a slow wave; around the cursor the dots swell,
  push apart and connect while an accent glow follows the pointer; a click sends a ripple through it. With no pointer
  (touch, idle) the glow wanders by itself, and with reduced motion the mesh is drawn once and stays still.
- `CrosshairCursor.tsx`: dot, lagging ring with ticks, faint guide lines and a coordinate label. It swells over links and
  buttons, pinches on click, is skipped on touch and for reduced motion, and the normal cursor returns over form fields.
- `ThemeToggle.tsx`: one button in the navbar cycles auto (follows the device), light and dark. The choice is saved and
  applied by a small script in `index.html` before first paint, so there is no flash.

## Design system

Two themes from one set of CSS variables (light base `#F4F5F7` with white surfaces; a near-black dark set), one crimson accent (`#D4223A`, slightly lifted in dark), Bricolage Grotesque for display, Manrope for
body, Mrs Saint Delafield for signature lines and JetBrains Mono for tickers. Tokens live in `tailwind.config.js` and
`src/index.css`. Reduced-motion preferences are respected throughout.

## Content

- `src/data/portfolioData.ts` holds the raw content (profile, projects, experience, skills, certifications).
- `src/data/site.ts` maps that content onto the sections and holds the remaining copy. Numbers shown in
  Achievements are taken from the figures already in the experience and project data.

## Characters

The character is a set of transparent WebP renders in `public/images/characters/`: `stand`, `think`, `code`, `celebrate`,
`thumbs-up`, `present`, `point-left`, `point-right` and `sit`, plus `avatar` (a face-and-shoulders crop used in the navbar
and hero greeting). Every pose shares one vertical scale and is trimmed to its own width, so size them by height.

`<Character pose="..." />` in `src/components/Character.tsx` loads them. To change a pose, replace its file, keep the
character the same height in the frame, and update the width in the `DIMS` table. The poses currently in use:
Hero (head turns with the cursor), About `thumbs-up`, Experience `think`, Projects `point-right` plus `point-left` on the
closing card, Skills `code` and `point-left`, Achievements `sit`, Contact `present` and `celebrate` on the success message.

The hero is built from nine pre-rendered looks over one constant body: `hero-body.webp` plus `look/{up-left,up,up-right,left,
center,right,down-left,down,down-right}.webp`, each a head-and-shoulders layer. `HeroCharacter.tsx` maps the pointer
(scaled to the distance to each screen edge) onto a 3 x 3 grid, holds a pose and crossfades quickly to the neighbouring one,
adds a small tilt, a breath, and reports the direction for the "Looking" readout. Touch devices look around on their own
and reduced motion shows the straight-ahead look.

The original Gemini renders (JPEG, white background) are kept in `design-assets/characters/`; they are not served. To
change the look set, regenerate all nine with the same framing and body, then re-cut them the same way.

## Contact form

With no backend the form opens the visitor's email app with the message filled in. To post to a form service instead,
set `VITE_CONTACT_ENDPOINT` (for example a Formspree URL) at build time.
