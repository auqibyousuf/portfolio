---
name: portfolio-animation-overhaul
description: Complete portfolio rebuild for Auqib Yousuf Ahangar with animation overhaul
metadata:
  type: project
---

## What was built

Single-file App.tsx rewrite with all content personalised and animations overhauled.

### New features added
- **Lenis** smooth scroll (replaces native scroll-behavior: smooth)
- **Custom cursor**: dot + lagged ring with mix-blend-mode:difference
- **Scroll progress bar**: Framer Motion scaleX spring-driven
- **Grain texture overlay**: animated SVG noise for film feel
- **MagneticWrap**: GSAP elastic magnetic button effect on hover
- **SectionHeader**: reusable GSAP clip-path + stagger reveal component
- **Hero**: character-level split-text GSAP entry (`name-char` spans)
- **Hero**: `useTransform` Framer parallax (y + opacity on scroll)
- **About section** (new): clip-path image reveal, staggered text lines, skill tags
- **WorksSection**: per-card GSAP scroll-triggered fade+scale with stagger by index
- **SkillsMarqueeSection** (new): dual-row infinite marquee, opposite directions
- **ExperienceSection** (new): vertical timeline with GSAP line-draw + item slide-in
- **StatsSection**: animated number counters (GSAP `obj.val` tween)
- **ContactFooter**: clip-path heading reveal + updated to Auqib's real email/links

### Content changes
- Name: Michael Smith → Auqib Yousuf Ahangar
- Role: Creative/Fullstack → Frontend/React/Drupal/Next.js
- Location: Chicago → Srinagar, India
- Email: hello@michaelsmith.com → aakkiibb@live.com
- Projects: generic → real work history projects
- Socials: GitHub + LinkedIn for auqibyousuf / aakkiibb
- Loading label: "Portfolio" → "auqib.dev"
- Initials: JA → AY

## Deviations from original
- Added 3 new sections: About, Skills Marquee, Experience Timeline
- `overflow-hidden` removed from root div (was `overflow-hidden`, broke sticky/pin)
- Navbar now has 4 items (added About, Experience)
