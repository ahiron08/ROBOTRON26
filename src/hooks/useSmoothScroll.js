import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useReducedMotion from './useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

/**
 * Smooth-scroll engine (Lenis) properly synced to GSAP ScrollTrigger.
 *   - skipped when the user prefers reduced motion (native scroll),
 *   - also skipped when the experimental `matchMedia` API is unavailable
 *     (Lenis depends on it internally) — native scroll is used instead
 *     and ScrollTrigger keeps working with the default scroller.
 */
export default function useSmoothScroll() {
  const reduced = useReducedMotion();
  const canLenis = typeof window !== 'undefined'
    && typeof window.matchMedia === 'function';

  useEffect(() => {
    if (reduced) return;

    // Lenis requires `window.matchMedia` internally; without it, fall back
    // to native scroll. ScrollTrigger works in both cases.
    if (!canLenis) return;

    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    lenis.on('scroll', ScrollTrigger.update);

    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, [reduced, canLenis]);

  return reduced;
}