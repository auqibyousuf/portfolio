# Portfolio — Auqib Yousuf Ahangar (redesign)

React 19, TypeScript, Vite, Tailwind CSS and Framer Motion, built around the [ThreeUI](https://threeui.com) Sylva
"Living Green" world.

```bash
npm install
npm run dev      # local dev server
npm run build    # type-check + production build
npm run lint
```

## ThreeUI integration

| Piece | Source |
| --- | --- |
| `SylvaHero` (Living Green) | Registered source bundle `sylva-hero.json`; files under `src/shaders/landing-pages/` and `src/shaders/threeui.css` are byte-identical to the registered SHA-256 hashes. `SylvaHero.tsx` is the SylvaHero section of the registered `LandingPages.tsx`, trimmed to the Living Green variant. |
| Authored page and runtime | `public/landing-pages/inner-green-3d.html`, `public/landing-pages/inner-green-assets/*` (copied byte-for-byte, hashes verified) |
| `SylvaLivingWorldScene` | `@designcodeio/threeui`, lazy-loaded as the persistent backdrop after the hero |
| `LiquidMetalButton` | `@designcodeio/threeui`, used for the main calls to action |

Content lives in `src/data/portfolioData.ts`.
