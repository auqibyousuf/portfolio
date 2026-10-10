# Portfolio — Auqib Yousuf Ahangar (redesign)

React 19, TypeScript, Vite, Tailwind CSS and Framer Motion, with [ThreeUI](https://threeui.com) 3D scenes.

```bash
npm install
npm run dev      # local dev server
npm run build    # type-check + production build
npm run lint
```

## ThreeUI usage

Scenes come from `@designcodeio/threeui` and are retinted to the moss palette with their `hue` and `brightness`
props. `src/components/SectionScene.tsx` code-splits them and mounts each one only while its section is near the
viewport.

| Section | Component |
| --- | --- |
| About (opener) | `ConstellationField` |
| Architecture | `LogicCoreField`, plus a `LiquidMetalButton` call to action |
| Stack | `ParticleDrift` |
| Experience | `GenerativeTree` |
| Explorations | `FlowField` |
| Contact | `EmeraldHorizonBackground`, plus a `LiquidMetalButton` call to action |

Work and Credentials stay as plain sections: none of the library's components could carry their content.
Most ThreeUI components are self-contained demos with baked-in copy, so only the clean background-style ones are used.

Content lives in `src/data/portfolioData.ts`.
