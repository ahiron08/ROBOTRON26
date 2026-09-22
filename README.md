# ROBOTRON 2026

A premium, cinematic cyberpunk/sci-fi event landing page built with **React + Vite**,
**GSAP + ScrollTrigger** and **Lenis** smooth-scrolling. The hero is a true 2.5D
environment — multiple physical depth layers that react independently to the
mouse and to scrolling.

## Quick start

```
npm install
npm run dev      # dev server (default http://localhost:5173)
npm run build    # production build → dist/
npm run preview  # serve the built output
```

## What’s inside

| Area            | Path                                        |
| --------------- | ------------------------------------------- |
| App root        | `src/App.jsx`                               |
| 2.5D scene      | `src/components/Hero/Hero.jsx` + `Hero.css` |
| Depth layer     | `src/components/ParallaxLayer/`             |
| Mouse parallax  | `src/components/ParallaxLayer/ParallaxProvider.jsx` |
| Scroll parallax | `Hero.jsx` (ScrollTrigger scrub tween)      |
| Custom cursor   | `src/components/CustomCursor/`              |
| Magnetic links  | `src/components/Magnetic/`                  |
| HUD labels      | `src/components/HUD/`                       |
| Nav + scroll    | `src/components/Navbar/`, `ScrollIndicator/`|
| Sections        | `src/sections/About … Contact/`             |
| Smooth scroll   | `src/hooks/useSmoothScroll.js` (Lenis)      |
| Hero assets     | `public/hero/**` (drop-in PNG/WebP slots)   |

## The 2.5D layer system

`ParallaxLayer` renders an absolutely-positioned scene slot and composes its
transform from CSS variables. **Mouse** parallax (`--mx/--my/--rx/--ry`, driven by
a single `requestAnimationFrame` loop in `ParallaxProvider`) and **scroll**
parallax (`--sx/--sy`, driven by the Hero’s ScrollTrigger scrub) never clobber
each other — they add up in CSS:

```css
transform: translate3d(
    calc(var(--mx,0px) + var(--sx,0px)),
    calc(var(--my,0px) + var(--sy,0px)), 0)
  rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg));
```

Tune a layer without touching the engine:

```jsx
<ParallaxLayer
  id="planet" slot="background" depth={0.14}
  mouseX={6} mouseY={4}        // px translate per unit cursor
  tiltY={0} tiltX={0}          // subtle 3D rotation (preserve-3d)
  sy={58} sx={-14}             // scroll offset px (negative = moves up faster)
  zIndex={3} animated
>
  <img src="/hero/background/planet.svg" alt="" className="planet-img" />
</ParallaxLayer>
```

See `public/hero/README.md` for the full slot map and how to swap in PNG/WebP
assets without rewriting the animation system.

## Performance & accessibility

- All animation is `transform`/`opacity`-based; no `top/left`, no per-frame React
  state. `will-change` is set only on layers that actually move.
- The mouse loop pauses when the tab is hidden; custom cursor and parallax are
  disabled on touch/tablet layouts.
- `prefers-reduced-motion` disables mouse parallax, cursor trails, scroll
  scrubbing and decorative animation (handled in both CSS and JS).
- Custom cursor is hidden for reduced motion / coarse pointers; navigation stays
  keyboard-accessible with visible focus states.

## Notes

- The hero scene ships with **procedurally authored SVG assets** in
  `public/hero/**` so it works out-of-the-box. Drop your transparent PNG/WebP
  assets into the matching folders and point `Hero.jsx` to them to replace them.
- `window.matchMedia` (detecting `prefers-reduced-motion` / breakpoints) is
  experimental, so all consumers fall back gracefully when it’s unavailable —
  the CSS `@media` rules still honour the user’s motion preference.