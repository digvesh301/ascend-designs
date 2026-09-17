"use client";

import { useState } from "react";
import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { ProjectImage } from "@/components/ui/project-image";
import { stockImages } from "@/lib/stock-images";
import { useMediaQuery } from "@/lib/use-media-query";

const SERVICES = [
  {
    num: "01",
    title: "Architecture",
    short: "Site to Structure",
    description:
      "We design buildings that respond to their site, climate and culture — translating spatial ambition into precise construction documents and built form.",
    deliverables: ["Concept Design", "Working Drawings", "Site Supervision", "3D Visualisation"],
    photo: stockImages.architecture,
    tone: 2 as const,
    href: undefined,
    ctaLabel: undefined,
  },
  {
    num: "02",
    title: "Interior Design",
    short: "Space to Experience",
    description:
      "Each interior is an expression of those who inhabit it. We compose material, light and form into environments that feel both beautiful and lived-in.",
    deliverables: ["Space Planning", "Material Selection", "Custom Joinery", "Lighting Design"],
    photo: stockImages.interiors,
    tone: 1 as const,
    href: undefined,
    ctaLabel: undefined,
  },
  {
    num: "03",
    title: "Turnkey Projects",
    short: "Design to Delivery",
    description:
      "From the first sketch to the final polish, we manage every vendor, contractor and timeline so the result matches the design — flawlessly.",
    deliverables: ["Project Management", "Contractor Coordination", "Procurement", "Handover"],
    photo: stockImages.hero,
    tone: 0 as const,
    href: "/budget-calculator",
    ctaLabel: "Estimate Your Budget",
  },
  {
    num: "04",
    title: "AD Living",
    short: "Furniture & Décor",
    description:
      "Bespoke furniture and curated decor objects that complete a space — each piece selected or designed to hold its own and enhance the whole.",
    deliverables: ["Bespoke Furniture", "Décor Curation", "Art Selection", "Styling"],
    photo: stockImages.adLivingDecor,
    tone: 3 as const,
    href: "/ad-living",
    ctaLabel: "View AD Living Gallery",
  },
];

function ServicePanel({
  svc,
  index,
  active,
  isFinePointer,
  onActivate,
}: {
  svc: (typeof SERVICES)[number];
  index: number;
  active: boolean;
  isFinePointer: boolean;
  onActivate: (i: number) => void;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-expanded={active}
      onClick={() => onActivate(index)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onActivate(index);
        }
      }}
      onMouseEnter={isFinePointer ? () => onActivate(index) : undefined}
      className="group relative flex min-h-[110px] cursor-pointer overflow-hidden text-left outline-none lg:min-h-0 lg:min-w-[120px]"
      style={{
        flex: active ? "5 1 0px" : "1 1 0px",
        transition: "flex 700ms cubic-bezier(0.65,0,0.35,1)",
      }}
    >
      {/* Background photo */}
      <div
        className="absolute inset-0 transition-transform duration-[1400ms] ease-out"
        style={{ transform: active ? "scale(1.06)" : "scale(1)" }}
      >
        <ProjectImage
          label={svc.title}
          tone={svc.tone}
          src={svc.photo}
          className="h-full w-full"
          sizes="(min-width: 1024px) 60vw, 100vw"
        />
      </div>
      <div
        className="absolute inset-0 transition-colors duration-500"
        style={{
          background: active
            ? "linear-gradient(to top, rgba(9,8,6,0.88) 0%, rgba(9,8,6,0.25) 55%, rgba(9,8,6,0.35) 100%)"
            : "linear-gradient(to top, rgba(9,8,6,0.82) 0%, rgba(9,8,6,0.55) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex w-full flex-col justify-between p-5 sm:p-7">
        {/* Number */}
        <span
          className={`font-display text-3xl font-semibold transition-colors duration-500 sm:text-4xl ${
            active ? "text-gold drop-shadow-sm" : "text-white/70"
          }`}
        >
          {svc.num}
        </span>

        {/* Collapsed label — vertical on desktop columns, horizontal on mobile bars */}
        <div
          className="flex items-center justify-between transition-opacity duration-300 lg:block lg:justify-start"
          style={{ opacity: active ? 0 : 1 }}
        >
          <span className="label text-white/90 text-sm font-semibold lg:hidden">{svc.title}</span>
          <span
            aria-hidden
            className="hidden whitespace-nowrap font-display text-2xl font-medium tracking-wide text-white/90 lg:block"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            {svc.title}
          </span>
          <span aria-hidden className="text-white/60 font-bold lg:hidden">+</span>
        </div>

        {/* Expanded content */}
        <div
          className="max-w-xl transition-all duration-500"
          style={{
            opacity: active ? 1 : 0,
            transform: active ? "translateY(0)" : "translateY(14px)",
            transitionDelay: active ? "220ms" : "0ms",
          }}
        >
          <p className="label mb-2 text-gold text-xs font-semibold tracking-[0.16em]">{svc.short}</p>
          <h3 className="font-display text-3xl font-medium text-white sm:text-4xl lg:text-5xl">
            {svc.title}
          </h3>
          <p className="mt-4 max-w-lg text-base sm:text-lg leading-relaxed text-white/95 font-normal">
            {svc.description}
          </p>
          <ul className="mt-6 flex flex-wrap gap-2.5">
            {svc.deliverables.map((d, i) => (
              <li
                key={d}
                className="label border border-gold/40 bg-gold/10 px-3.5 py-1.5 text-xs text-gold font-medium rounded-full transition-all duration-400"
                style={{
                  opacity: active ? 1 : 0,
                  transform: active ? "translateY(0)" : "translateY(8px)",
                  transitionDelay: active ? `${320 + i * 60}ms` : "0ms",
                }}
              >
                {d}
              </li>
            ))}
          </ul>
          {svc.href && (
            <Link
              href={svc.href}
              onClick={(e) => e.stopPropagation()}
              className="label mt-7 inline-flex items-center gap-2.5 text-gold text-xs sm:text-sm font-semibold transition-all duration-400 hover:gap-3.5"
              style={{
                opacity: active ? 1 : 0,
                transform: active ? "translateY(0)" : "translateY(8px)",
                transitionDelay: active ? "580ms" : "0ms",
              }}
            >
              {svc.ctaLabel} <span aria-hidden>→</span>
            </Link>
          )}
        </div>
      </div>

      {/* Edge accent */}
      <span
        className="pointer-events-none absolute inset-y-0 left-0 w-[2px] bg-gold transition-opacity duration-500"
        style={{ opacity: active ? 1 : 0 }}
      />
    </div>
  );
}

export function Services() {
  const [active, setActive] = useState(0);
  const isFinePointer = useMediaQuery("(pointer: fine)");

  return (
    <section
      id="services"
      className="relative overflow-hidden border-t border-line py-28 sm:py-36 lg:py-44"
    >
      {/* Section number */}
      <span
        aria-hidden
        className="pointer-events-none absolute -left-2 top-1/2 -translate-y-1/2 select-none font-display text-[22vw] leading-none text-white/[0.025]"
      >
        03
      </span>

      <div className="relative mx-auto max-w-[1600px] px-6 sm:px-12 lg:px-20">
        {/* Header */}
        <Reveal>
          <div className="mb-10 flex items-center gap-5">
            <span className="h-px w-10 bg-gold/50" />
            <p className="label text-gold/80">Services</p>
          </div>
          <h2 className="mb-14 font-display text-[clamp(2rem,4.5vw,4rem)] font-light leading-[1.05] text-ink">
            What We Do
          </h2>
        </Reveal>

        {/* Hover-expanding panels */}
        <Reveal delay={0.1}>
          <div
            className="flex h-[560px] flex-col gap-[2px] overflow-hidden rounded-sm sm:h-[600px] lg:h-[620px] lg:flex-row"
            onMouseLeave={isFinePointer ? () => setActive(0) : undefined}
          >
            {SERVICES.map((svc, i) => (
              <ServicePanel
                key={svc.num}
                svc={svc}
                index={i}
                active={active === i}
                isFinePointer={isFinePointer}
                onActivate={setActive}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
