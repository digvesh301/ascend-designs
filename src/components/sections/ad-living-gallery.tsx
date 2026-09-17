"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap } from "@/lib/gsap";
import { adLivingPieces, type AdLivingPiece } from "@/data/ad-living";

const CATEGORIES = [
  { id: "all", label: "All Pieces", count: adLivingPieces.length },
  ...Array.from(new Set(adLivingPieces.map((p) => p.category))).map((cat) => ({
    id: cat,
    label: cat,
    count: adLivingPieces.filter((p) => p.category === cat).length,
  })),
];

// ─── Lightbox ───────────────────────────────────────────────────────────────
function Lightbox({
  pieces,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  pieces: AdLivingPiece[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const piece = pieces[index];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose, onPrev, onNext]);

  function handleTouchStart(e: React.TouchEvent) {
    setTouchStart(e.touches[0].clientX);
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (diff > 40) onNext();
    if (diff < -40) onPrev();
    setTouchStart(null);
  }

  if (!mounted || !piece) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={piece.title}
      className="fixed inset-0 z-[99999] flex flex-col justify-between bg-[#080807]/98 backdrop-blur-lg p-3 sm:p-6 lg:p-8"
      onClick={onClose}
    >
      {/* Top Header Bar */}
      <div
        className="relative z-10 flex items-center justify-between border-b border-white/10 pb-3 sm:pb-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pr-2 min-w-0 flex-1">
          <h3 className="font-display text-base sm:text-xl md:text-2xl font-medium text-white truncate">{piece.title}</h3>
          <p className="label mt-0.5 text-[0.6875rem] sm:text-xs text-gold font-semibold truncate">{piece.category}</p>
        </div>
        <button
          type="button"
          aria-label="Close dialog"
          onClick={onClose}
          className="label shrink-0 inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-3.5 py-1.5 text-[0.7rem] sm:px-5 sm:py-2 sm:text-xs font-semibold text-white transition-all hover:border-gold hover:bg-gold hover:text-black cursor-pointer shadow-md"
        >
          <span>Close</span>
          <span className="text-xs font-bold sm:text-sm">✕</span>
        </button>
      </div>

      {/* Main Image View with Touch Support */}
      <div
        className="relative flex flex-1 items-center justify-center py-2 sm:py-4 overflow-hidden select-none"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={piece.src}
          src={piece.src}
          alt={piece.title}
          className="max-h-[62vh] sm:max-h-[74vh] w-auto max-w-full object-contain rounded-sm shadow-2xl transition-all duration-300"
          style={{ animation: "adLbFade 0.25s cubic-bezier(0.16,1,0.3,1) both" }}
          loading="eager"
        />

        {pieces.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Prev"
              onClick={(e) => {
                e.stopPropagation();
                onPrev();
              }}
              className="absolute left-1 sm:left-6 top-1/2 -translate-y-1/2 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-white/30 bg-black/60 text-lg sm:text-xl text-white backdrop-blur-md transition-all hover:border-gold hover:bg-gold hover:text-black cursor-pointer shadow-lg"
            >
              ←
            </button>
            <button
              type="button"
              aria-label="Next"
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              className="absolute right-1 sm:right-6 top-1/2 -translate-y-1/2 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-white/30 bg-black/60 text-lg sm:text-xl text-white backdrop-blur-md transition-all hover:border-gold hover:bg-gold hover:text-black cursor-pointer shadow-lg"
            >
              →
            </button>
          </>
        )}
      </div>

      {/* Bottom Footer Bar with Mobile Navigation Controls */}
      <div
        className="relative z-10 flex items-center justify-between border-t border-white/10 pt-3 sm:pt-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2">
          {pieces.length > 1 && (
            <div className="flex items-center gap-1.5 sm:hidden">
              <button
                type="button"
                onClick={onPrev}
                className="label px-2.5 py-1 rounded bg-white/10 border border-white/20 text-[0.65rem] text-white"
              >
                ← Prev
              </button>
              <button
                type="button"
                onClick={onNext}
                className="label px-2.5 py-1 rounded bg-white/10 border border-white/20 text-[0.65rem] text-white"
              >
                Next →
              </button>
            </div>
          )}
          <span className="label text-[0.7rem] sm:text-xs text-white/90 font-medium">
            Piece <span className="text-gold font-bold">{index + 1}</span> of <span className="text-gold font-bold">{pieces.length}</span>
          </span>
        </div>

        <span className="label text-xs text-white/50 hidden sm:inline-block">
          Swipe or Use ← → Arrow Keys
        </span>
      </div>

      <style>{`
        @keyframes adLbFade {
          from { opacity: 0; transform: scale(0.96); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>,
    document.body
  );
}

// ─── Single grid tile ───────────────────────────────────────────────────────
function Tile({
  piece,
  index,
  onClick,
}: {
  piece: AdLivingPiece;
  index: number;
  onClick: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { rootMargin: "180px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <button
      ref={ref}
      type="button"
      data-cursor="view"
      data-cursor-label="View"
      onClick={onClick}
      className="group relative block aspect-[4/5] h-full w-full overflow-hidden bg-surface-strong transition-all duration-500 ease-out"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "scale(1)" : "scale(0.92)",
        contentVisibility: "auto",
        containIntrinsicSize: "220px 275px",
      }}
      aria-label={`View ${piece.title}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={piece.src}
        alt={piece.title}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
      />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-[#0c0b09]/95 via-[#0c0b09]/75 to-transparent px-3 pb-3 pt-8 transition-transform duration-400 ease-out group-hover:translate-y-0 sm:px-4 sm:pb-4">
        <span aria-hidden className="mb-1.5 block h-[2px] w-8 bg-gold" />
        <p className="font-display text-sm leading-tight text-white line-clamp-1 sm:text-base">
          {piece.title}
        </p>
        <p className="label mt-1 text-[0.5rem] text-white/60">{piece.category}</p>
      </div>
    </button>
  );
}

// ─── AD Living Gallery ──────────────────────────────────────────────────────
export function AdLivingGallery() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const filterBarRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);

  const filtered =
    activeCategory === "all"
      ? adLivingPieces
      : adLivingPieces.filter((p) => p.category === activeCategory);

  function moveIndicator(btn: HTMLButtonElement) {
    const bar = filterBarRef.current;
    const ind = indicatorRef.current;
    if (!bar || !ind) return;
    const barRect = bar.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    ind.style.left = `${btnRect.left - barRect.left + bar.scrollLeft}px`;
    ind.style.width = `${btnRect.width}px`;
  }

  function handleFilter(id: string, e: React.MouseEvent<HTMLButtonElement>) {
    setActiveCategory(id);
    setLightboxIndex(null);
    moveIndicator(e.currentTarget);
  }

  function openLightbox(idx: number) {
    setLightboxIndex(idx);
  }
  function closeLightbox() {
    setLightboxIndex(null);
  }
  function goPrev() {
    setLightboxIndex((i) => (i === null ? null : (i - 1 + filtered.length) % filtered.length));
  }
  function goNext() {
    setLightboxIndex((i) => (i === null ? null : (i + 1) % filtered.length));
  }

  useEffect(() => {
    document.body.style.overflow = lightboxIndex !== null ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightboxIndex]);

  return (
    <>
      {CATEGORIES.length > 2 && (
        <div className="relative mb-8 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          <div ref={filterBarRef} className="relative flex w-max gap-2 border-b border-line pb-px">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={(e) => handleFilter(c.id, e)}
                className={`label whitespace-nowrap px-4 py-3 text-[0.625rem] transition-colors sm:px-5 ${
                  activeCategory === c.id ? "text-gold" : "text-ink-faint hover:text-ink-soft"
                }`}
              >
                {c.label}
                <span className="ml-1.5 text-[0.5rem] opacity-50">({c.count})</span>
              </button>
            ))}
            <span
              ref={indicatorRef}
              className="absolute bottom-0 h-[2px] bg-gold transition-all duration-300 ease-out"
              style={{ left: 0, width: 0 }}
            />
          </div>
        </div>
      )}

      <div
        key={activeCategory}
        className="grid grid-cols-2 gap-[3px] sm:grid-cols-3 sm:gap-1 lg:grid-cols-4"
      >
        {filtered.map((piece, i) => (
          <Tile key={piece.id} piece={piece} index={i} onClick={() => openLightbox(i)} />
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-line pt-6">
        <span className="label text-[0.5625rem] text-ink-faint">
          Showing <span className="text-gold">{filtered.length}</span> piece
          {filtered.length === 1 ? "" : "s"}
        </span>
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          pieces={filtered}
          index={lightboxIndex}
          onClose={closeLightbox}
          onPrev={goPrev}
          onNext={goNext}
        />
      )}
    </>
  );
}
