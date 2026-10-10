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

## Design system

One light base (`#F4F5F7`), white surfaces, one crimson accent (`#D4223A`), Bricolage Grotesque for display, Manrope for
body, Mrs Saint Delafield for signature lines and JetBrains Mono for tickers. Tokens live in `tailwind.config.js` and
`src/index.css`. Reduced-motion preferences are respected throughout.

## Content

- `src/data/portfolioData.ts` holds the raw content (profile, projects, experience, skills, certifications).
- `src/data/site.ts` maps that content onto the sections and holds the remaining copy. Numbers shown in
  Achievements are taken from the figures already in the experience and project data.

## Characters and photo

The character is an original SVG illustration (`src/components/Character.tsx`) with nine poses. To use your own
GenEmoji renders instead, put PNGs in `public/characters/` and map a pose to its file in `SITE.characters`
(`src/data/site.ts`), for example `{ stand: "/characters/stand.png" }`. Set `SITE.photo` to use a real profile photo.

## Contact form

With no backend the form opens the visitor's email app with the message filled in. To post to a form service instead,
set `VITE_CONTACT_ENDPOINT` (for example a Formspree URL) at build time.
