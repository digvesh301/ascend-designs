"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { Reveal } from "@/components/motion/reveal";
import { CountUp } from "@/components/motion/count-up";
import { ProjectImage } from "@/components/ui/project-image";
import {
  projects as allProjects,
  type Project,
  type ProjectCategory,
  type ProjectLayout,
} from "@/data/projects";

type CategoryFilter = "all" | ProjectCategory;

// Bento sizing per project — driven by the `layout` already set in the data,
// so adding a new project just means picking one of these four shapes.
const LAYOUT_SPAN: Record<ProjectLayout, string> = {
  full: "col-span-2 row-span-2",
  horizontal: "col-span-2 row-span-1",
  portrait: "col-span-1 row-span-2",
  compact: "col-span-1 row-span-1",
};

// ─── Single project tile ───────────────────────────────────────────────────
function ProjectTile({
  project,
  index,
  onClick,
}: {
  project: Project;
  index: number;
  onClick: () => void;
}) {
  const cardRef = useRef<HTMLButtonElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
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
      ref={cardRef}
      type="button"
      data-cursor="view"
      data-cursor-label="View Project"
      onClick={onClick}
      className={`group relative block h-full w-full overflow-hidden bg-surface-strong text-left transition-all duration-700 ease-out ${LAYOUT_SPAN[project.layout]}`}
      style={{
        clipPath: isVisible ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)",
        opacity: isVisible ? 1 : 0,
        contentVisibility: "auto",
        containIntrinsicSize: "280px 280px",
      }}
      aria-label={`View ${project.title}`}
    >
      {/* Image */}
      <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.06]">
        <ProjectImage
          label={project.coverImage}
          tone={project.tone}
          src={project.image}
          sizes="(min-width: 1024px) 45vw, 90vw"
          className="h-full w-full"
        />
      </div>

      {/* Photo-count badge — always visible, signals depth before the click */}
      <div className="absolute right-3 top-3 flex items-center gap-1.5 bg-[#0c0b09]/60 px-2.5 py-1.5 backdrop-blur-sm">
        <span aria-hidden className="block h-1 w-1 rounded-full bg-gold" />
        <span className="label text-[0.55rem] text-white/80">
          {project.gallery.length} Photos
        </span>
      </div>

      {/* Bottom gradient + info */}
      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-[#0c0b09]/95 via-[#0c0b09]/15 to-transparent p-4 sm:p-6">
        <p className="label text-gold/80">{project.category}</p>
        <h3 className="mt-1.5 font-display text-xl font-light leading-tight text-white sm:text-2xl lg:text-3xl">
          {project.title}
        </h3>
        <div className="mt-2 flex translate-y-2 items-center justify-between opacity-0 transition-all duration-400 group-hover:translate-y-0 group-hover:opacity-100">
          <p className="label text-white/50">
            {project.location} · {project.year}
          </p>
          <span aria-hidden className="text-gold">→</span>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 border border-white/0 transition-colors duration-300 group-hover:border-gold/30" />
    </button>
  );
}

import { createPortal } from "react-dom";

// ─── Project viewer (case-study lightbox) ──────────────────────────────────
function ProjectViewer({
  project,
  imageIndex,
  onClose,
  onPrevImage,
  onNextImage,
  onNextProject,
}: {
  project: Project;
  imageIndex: number;
  onClose: () => void;
  onPrevImage: () => void;
  onNextImage: () => void;
  onNextProject: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrevImage();
      if (e.key === "ArrowRight") onNextImage();
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose, onPrevImage, onNextImage]);

  function handleTouchStart(e: React.TouchEvent) {
    setTouchStart(e.touches[0].clientX);
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (diff > 40) onNextImage();
    if (diff < -40) onPrevImage();
    setTouchStart(null);
  }

  if (!mounted || !project) return null;

  const src = project.gallery[imageIndex] ?? project.image;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
      className="fixed inset-0 z-[99999] flex flex-col justify-between bg-[#080807]/98 backdrop-blur-lg p-3 sm:p-6 lg:p-8"
      onClick={onClose}
    >
      {/* Top bar */}
      <div
        className="relative z-10 flex items-center justify-between border-b border-white/10 pb-3 sm:pb-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pr-2 min-w-0 flex-1">
          <p className="label text-gold font-semibold text-[0.6875rem] sm:text-xs">{project.category}</p>
          <h3 className="font-display text-base sm:text-xl md:text-2xl font-medium text-white truncate mt-0.5">
            {project.title}
          </h3>
        </div>
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="label shrink-0 inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-3.5 py-1.5 text-[0.7rem] sm:px-5 sm:py-2 sm:text-xs font-semibold text-white transition-all hover:border-gold hover:bg-gold hover:text-black cursor-pointer shadow-md"
        >
          <span>Close</span>
          <span className="text-xs font-bold sm:text-sm">✕</span>
        </button>
      </div>

      {/* Image View with Touch Support */}
      <div
        className="relative flex flex-1 items-center justify-center py-2 sm:py-4 overflow-hidden select-none"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={src}
          src={src}
          alt={project.title}
          className="max-h-[60vh] sm:max-h-[74vh] w-auto max-w-full object-contain rounded-sm shadow-2xl transition-all duration-300"
          style={{ animation: "pvFade 0.25s cubic-bezier(0.16,1,0.3,1) both" }}
          loading="eager"
        />
        {project.gallery.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={(e) => {
                e.stopPropagation();
                onPrevImage();
              }}
              className="absolute left-1 sm:left-6 top-1/2 -translate-y-1/2 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-white/30 bg-black/60 text-lg sm:text-xl text-white backdrop-blur-md transition-all hover:border-gold hover:bg-gold hover:text-black cursor-pointer shadow-lg"
            >
              ←
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={(e) => {
                e.stopPropagation();
                onNextImage();
              }}
              className="absolute right-1 sm:right-6 top-1/2 -translate-y-1/2 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-white/30 bg-black/60 text-lg sm:text-xl text-white backdrop-blur-md transition-all hover:border-gold hover:bg-gold hover:text-black cursor-pointer shadow-lg"
            >
              →
            </button>
          </>
        )}
      </div>

      {/* Bottom info bar */}
      <div
        className="relative z-10 flex flex-col gap-3 border-t border-white/10 pt-3 sm:pt-4 sm:flex-row sm:items-end sm:justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="max-w-xl">
          <p className="label text-[0.6875rem] sm:text-xs text-white/80 font-medium">
            {project.location} · {project.year}
          </p>
          <p className="mt-1 text-xs sm:text-sm leading-relaxed text-white/90 font-normal line-clamp-2 sm:line-clamp-none">
            {project.description}
          </p>
        </div>
        <div className="flex shrink-0 items-center justify-between sm:justify-start gap-4">
          <p className="label text-[0.7rem] sm:text-xs text-white/70 font-medium">
            Photo <span className="text-gold font-bold">{imageIndex + 1}</span> of <span className="text-gold font-bold">{project.gallery.length}</span>
          </p>
          <button
            type="button"
            onClick={onNextProject}
            className="label inline-flex items-center gap-1.5 text-gold text-xs font-semibold hover:text-white transition-colors"
          >
            Next Project <span aria-hidden>→</span>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes pvFade {
          from { opacity: 0; transform: scale(0.96); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>,
    document.body
  );
}

// ─── Project Wall ───────────────────────────────────────────────────────────
export function ProjectWall() {
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>("all");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [imageIndex, setImageIndex] = useState(0);
  const filterBarRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);

  const totalPhotos = useMemo(
    () => allProjects.reduce((sum, p) => sum + p.gallery.length, 0),
    []
  );

  // Only show categories that actually have a project in them.
  const categories = useMemo(() => {
    const counts = new Map<ProjectCategory, number>();
    allProjects.forEach((p) =>
      counts.set(p.category, (counts.get(p.category) ?? 0) + 1)
    );
    return [
      { label: "All Work", value: "all" as const, count: allProjects.length },
      ...Array.from(counts.entries()).map(([value, count]) => ({
        label: value.charAt(0).toUpperCase() + value.slice(1),
        value,
        count,
      })),
    ];
  }, []);

  const filtered =
    activeFilter === "all"
      ? allProjects
      : allProjects.filter((p) => p.category === activeFilter);

  const moveIndicator = useCallback((btn: HTMLButtonElement) => {
    const bar = filterBarRef.current;
    const ind = indicatorRef.current;
    if (!bar || !ind) return;
    const barRect = bar.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    ind.style.left = `${btnRect.left - barRect.left}px`;
    ind.style.width = `${btnRect.width}px`;
  }, []);

  function handleFilter(val: CategoryFilter, e: React.MouseEvent<HTMLButtonElement>) {
    setActiveFilter(val);
    moveIndicator(e.currentTarget);
  }

  function openProject(idx: number) {
    setActiveIndex(idx);
    setImageIndex(0);
  }
  function closeProject() {
    setActiveIndex(null);
  }
  function prevImage() {
    if (activeIndex === null) return;
    const len = filtered[activeIndex].gallery.length;
    setImageIndex((i) => (i - 1 + len) % len);
  }
  function nextImage() {
    if (activeIndex === null) return;
    const len = filtered[activeIndex].gallery.length;
    setImageIndex((i) => (i + 1) % len);
  }
  function nextProject() {
    setActiveIndex((i) => (i === null ? null : (i + 1) % filtered.length));
    setImageIndex(0);
  }

  const activeProject = activeIndex !== null ? filtered[activeIndex] : null;

  useEffect(() => {
    document.body.style.overflow = activeProject ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeProject]);

  return (
    <>
      <section id="work" className="px-4 pb-24 pt-14 sm:px-8 sm:pb-32 sm:pt-16 lg:px-12 lg:pb-40 lg:pt-20">
        <div className="mx-auto max-w-[1600px]">
          {/* ── Header ──────────────────────────────────────────────────── */}
          <Reveal>
            <div className="mb-6 flex items-center gap-4">
              <span className="h-px w-10 bg-gold/50" />
              <p className="label text-gold/70">Portfolio</p>
            </div>
            <div className="mb-14 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <h2 className="font-display text-[clamp(2.75rem,7vw,6.5rem)] font-light leading-[0.98] text-ink">
                <CountUp value={40} suffix="+" />
                <br />
                <em className="italic text-gold">Completed Projects</em>
              </h2>
              <p className="max-w-[300px] text-sm leading-relaxed text-ink-soft">
                A selection of the work we&rsquo;re proudest of —{" "}
                {allProjects.length} featured case studies, {totalPhotos}+
                photographs. Click any project to step inside.
              </p>
            </div>
          </Reveal>

          {/* ── Filter tabs ──────────────────────────────────────────────── */}
          <Reveal delay={0.08}>
            <div className="relative mb-10">
              <div
                ref={filterBarRef}
                className="relative flex flex-wrap gap-2 border-b border-line pb-px sm:gap-0"
              >
                {categories.map(({ label, value, count }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={(e) => handleFilter(value, e)}
                    className={`label px-4 py-3 text-[0.625rem] transition-colors sm:px-5 ${
                      activeFilter === value ? "text-gold" : "text-ink-faint hover:text-ink-soft"
                    }`}
                  >
                    {label}
                    <span className="ml-1.5 text-[0.5rem] opacity-50">({count})</span>
                  </button>
                ))}
                <span
                  ref={indicatorRef}
                  className="absolute bottom-0 h-[2px] bg-gold transition-all duration-300 ease-out"
                  style={{ left: 0, width: 0 }}
                />
              </div>
            </div>
          </Reveal>

          {/* ── Bento project grid ───────────────────────────────────────── */}
          <div
            key={activeFilter}
            className="grid auto-rows-[200px] grid-cols-2 gap-3 [grid-auto-flow:dense] sm:auto-rows-[240px] sm:grid-cols-3 sm:gap-4 lg:auto-rows-[280px] lg:grid-cols-4"
          >
            {filtered.map((project, i) => (
              <ProjectTile
                key={project.id}
                project={project}
                index={i}
                onClick={() => openProject(i)}
              />
            ))}
          </div>

          {/* ── Footer ───────────────────────────────────────────────────── */}
          <Reveal delay={0.1}>
            <div className="mt-14 flex flex-wrap items-center justify-between gap-6 border-t border-line pt-8">
              <span className="label text-[0.5625rem] text-ink-faint">
                Showing <span className="text-gold">{filtered.length}</span> featured{" "}
                {filtered.length === 1 ? "project" : "projects"}
              </span>
              <Link
                href="/projects"
                className="label inline-flex items-center gap-3 border border-line-strong px-7 py-3.5 text-ink-soft transition-colors hover:border-gold/50 hover:text-gold"
              >
                View Full Portfolio <span aria-hidden>→</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Case-study viewer ────────────────────────────────────────────── */}
      {activeProject && (
        <ProjectViewer
          project={activeProject}
          imageIndex={imageIndex}
          onClose={closeProject}
          onPrevImage={prevImage}
          onNextImage={nextImage}
          onNextProject={nextProject}
        />
      )}
    </>
  );
}
