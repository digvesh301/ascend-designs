"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIsSettled } from "@/components/loader/loader";

// Module-level so components outside this provider (e.g. hash-scroll
// links from other routes) can drive Lenis instead of fighting it with
// a native `scrollIntoView`.
let activeLenis: Lenis | null = null;
export function getLenis() {
  return activeLenis;
}

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const isSettled = useIsSettled();

  useEffect(() => {
    // Nothing scrolls while the loader holds the page, and `lagSmoothing(0)`
    // below would let the intro timeline jump on any hydration stall instead
    // of easing through it — so hold off until the doors have opened.
    if (!isSettled) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 0.75,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -8 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.2,
    });

    lenis.on("scroll", ScrollTrigger.update);
    activeLenis = lenis;

    // Drive Lenis off GSAP's ticker (instead of a separate rAF loop) so
    // scroll-linked animations stay perfectly in sync with smooth scroll.
    const update = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(500, 33);

    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
      activeLenis = null;
    };
  }, [isSettled]);

  return <>{children}</>;
}
