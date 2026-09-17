"use client";

import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@/lib/use-media-query";
import { useIsSettled } from "@/components/loader/loader";

// Desktop-only (pointer:fine) charcoal dot that expands and labels itself
// when hovering any element carrying data-cursor="view" | "cta".
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const isFinePointer = useMediaQuery("(pointer: fine)");
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  // Held back until the intro finishes: the dot is invisible under the loader
  // anyway, and its `mix-blend-difference` layer forces the whole stack below
  // it to re-composite every frame — ruinous while the doors are swinging.
  const isSettled = useIsSettled();
  const enabled = isFinePointer && !reducedMotion && isSettled;
  const [label, setLabel] = useState<string | null>(null);
  const [variant, setVariant] = useState<"default" | "view" | "cta">("default");

  useEffect(() => {
    if (!enabled) return;

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const target = { x: pos.x, y: pos.y };
    let rafId: number;

    function onMove(e: PointerEvent) {
      target.x = e.clientX;
      target.y = e.clientY;
    }

    function tick() {
      pos.x += (target.x - pos.x) * 0.18;
      pos.y += (target.y - pos.y) * 0.18;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
      }
      rafId = requestAnimationFrame(tick);
    }

    function onOver(e: PointerEvent) {
      const el = (e.target as HTMLElement)?.closest?.("[data-cursor]");
      if (el instanceof HTMLElement) {
        const kind = el.dataset.cursor as "view" | "cta";
        setVariant(kind);
        setLabel(el.dataset.cursorLabel ?? (kind === "view" ? "View" : null));
      }
    }

    function onOut(e: PointerEvent) {
      const el = (e.target as HTMLElement)?.closest?.("[data-cursor]");
      if (el) {
        setVariant("default");
        setLabel(null);
      }
    }

    window.addEventListener("pointermove", onMove);
    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerout", onOut);
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
      cancelAnimationFrame(rafId);
    };
  }, [enabled]);

  if (!enabled) return null;

  const isExpanded = variant !== "default";

  return (
    <div
      ref={dotRef}
      aria-hidden
      className="cursor-dot pointer-events-none fixed left-0 top-0 z-[100] flex items-center justify-center rounded-full bg-gold text-[#0a0908] shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-[width,height,background-color] duration-300 ease-out"
      style={{
        width: isExpanded ? (variant === "view" ? 72 : 54) : 10,
        height: isExpanded ? (variant === "view" ? 72 : 54) : 10,
        backgroundColor: isExpanded ? "#d4af37" : "rgba(212,175,55,0.85)",
      }}
    >
      {label && (
        <span className="label text-[10px] font-bold text-[#0a0908]">{label}</span>
      )}
    </div>
  );
}
