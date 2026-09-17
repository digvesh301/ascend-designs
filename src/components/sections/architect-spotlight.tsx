"use client";

import { useState } from "react";
import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { CountUp } from "@/components/motion/count-up";
import { ProjectImage } from "@/components/ui/project-image";
import { useMediaQuery } from "@/lib/use-media-query";
import { siteConfig } from "@/lib/site-config";
import { stockImages } from "@/lib/stock-images";

const PILLARS = [
  {
    num: "01",
    title: "Spatial Context",
    desc: "Designing in dialogue with microclimate, natural light, and urban surroundings.",
    photo: stockImages.architecture,
    tone: 2 as const,
  },
  {
    num: "02",
    title: "Material Honesty",
    desc: "Raw stone, warm woods, textured plasters and refined metals that age gracefully.",
    photo: stockImages.adLivingJoinery,
    tone: 0 as const,
  },
  {
    num: "03",
    title: "Turnkey Integrity",
    desc: "Ensuring what is envisioned in 3D is crafted flawlessly on-site, to the last millimetre.",
    photo: stockImages.hero,
    tone: 1 as const,
  },
];

function PillarPanel({
  pillar,
  index,
  active,
  isFinePointer,
  onActivate,
}: {
  pillar: (typeof PILLARS)[number];
  index: number;
  active: boolean;
  isFinePointer: boolean;
  onActivate: (i: number) => void;
}) {
  return (
    <button
      type="button"
      aria-expanded={active}
      onClick={() => onActivate(index)}
      onMouseEnter={isFinePointer ? () => onActivate(index) : undefined}
      className="group relative flex min-h-[84px] overflow-hidden text-left outline-none"
      style={{
        flex: active ? "5 1 0px" : "1 1 0px",
        transition: "flex 700ms cubic-bezier(0.65,0,0.35,1)",
      }}
    >
      <div
        className="absolute inset-0 transition-transform duration-[1400ms] ease-out"
        style={{ transform: active ? "scale(1.06)" : "scale(1)" }}
      >
        <ProjectImage
          label={pillar.title}
          tone={pillar.tone}
          src={pillar.photo}
          className="h-full w-full"
          sizes="(min-width: 1024px) 40vw, 100vw"
        />
      </div>
      <div
        className="absolute inset-0 transition-colors duration-500"
        style={{
          background: active
            ? "linear-gradient(to top, rgba(9,8,6,0.88) 0%, rgba(9,8,6,0.2) 60%)"
            : "linear-gradient(to top, rgba(9,8,6,0.85) 0%, rgba(9,8,6,0.55) 100%)",
        }}
      />

      <div className="relative z-10 flex w-full items-center gap-6 p-5 sm:p-6">
        <span
          className={`font-display text-base transition-colors duration-500 ${
            active ? "text-gold" : "text-white/50"
          }`}
        >
          {pillar.num}
        </span>
        <div className="flex-1">
          <p
            className={`font-display text-xl transition-colors duration-500 sm:text-2xl ${
              active ? "text-white" : "text-white/70"
            }`}
          >
            {pillar.title}
          </p>
          <div
            className="overflow-hidden transition-all duration-500"
            style={{
              maxHeight: active ? "4rem" : "0px",
              opacity: active ? 1 : 0,
              transitionDelay: active ? "180ms" : "0ms",
            }}
          >
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/70">
              {pillar.desc}
            </p>
          </div>
        </div>
      </div>

      <span
        className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gold transition-opacity duration-500"
        style={{ opacity: active ? 1 : 0 }}
      />
    </button>
  );
}

export function ArchitectSpotlight() {
  const [active, setActive] = useState(0);
  const isFinePointer = useMediaQuery("(pointer: fine)");

  return (
    <section id="about" className="relative overflow-hidden border-t border-line bg-surface-alt py-28 sm:py-36 lg:py-44">
      {/* Section number */}
      <span
        aria-hidden
        className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 select-none font-display text-[22vw] leading-none text-white/[0.025]"
      >
        05
      </span>

      <div className="relative mx-auto max-w-[1600px] px-6 sm:px-12 lg:px-20">
        <Reveal>
          <div className="mb-16 flex items-center gap-5">
            <span className="h-px w-10 bg-gold" />
            <p className="label text-gold font-semibold">The Architect</p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-10">
          {/* Left: name + quote + bio */}
          <div className="lg:col-span-6">
            <Reveal>
              <h2 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] font-medium leading-[1.05] text-ink">
                {siteConfig.founder}
              </h2>
              <p className="label mt-3 text-gold text-sm font-semibold">{siteConfig.founderTitle}</p>
            </Reveal>

            <Reveal delay={0.1}>
              <blockquote className="mt-10 border-l-2 border-gold pl-6 font-display text-2xl italic leading-relaxed text-ink sm:text-3xl">
                &ldquo;Architecture is not merely about constructing walls — it is
                about sculpting light, proportion, and human emotion into living
                sanctuaries.&rdquo;
              </blockquote>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="mt-8 text-base sm:text-lg leading-relaxed text-ink-soft font-normal">
                {siteConfig.founderBio}
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link
                  href="/contact"
                  className="label inline-flex items-center gap-2.5 border border-line-strong px-7 py-4 text-xs font-semibold text-ink transition-colors hover:border-gold hover:text-gold"
                >
                  Schedule Consultation <span aria-hidden>→</span>
                </Link>
              </div>
            </Reveal>
          </div>

          {/* Right: design pillars + stats */}
          <div className="lg:col-span-5 lg:col-start-8">
            <Reveal delay={0.1}>
              <h3 className="font-display text-2xl font-light text-ink-soft">
                Core Design Pillars
              </h3>
            </Reveal>

            <Reveal delay={0.15}>
              <div
                className="mt-8 flex h-[380px] flex-col gap-[2px] overflow-hidden rounded-sm"
                onMouseLeave={isFinePointer ? () => setActive(0) : undefined}
              >
                {PILLARS.map((p, i) => (
                  <PillarPanel
                    key={p.num}
                    pillar={p}
                    index={i}
                    active={active === i}
                    isFinePointer={isFinePointer}
                    onActivate={setActive}
                  />
                ))}
              </div>
            </Reveal>

            {/* Stats */}
            <Reveal delay={0.4}>
              <div className="mt-10 grid grid-cols-2 gap-6 border-t border-line pt-10">
                <div>
                  <p className="font-display text-4xl font-light text-ink">
                    <CountUp value={100} suffix="+" />
                  </p>
                  <p className="label mt-1 text-ink-faint">Spaces Transformed</p>
                </div>
                <div>
                  <p className="font-display text-4xl font-light text-gold">
                    <CountUp value={100} suffix="%" />
                  </p>
                  <p className="label mt-1 text-ink-faint">Turnkey Execution</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
