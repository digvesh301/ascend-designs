"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { Reveal } from "@/components/motion/reveal";

const STEPS = [
  {
    title: "Consultation",
    description: "Understanding the vision, requirements and lifestyle.",
  },
  {
    title: "Design Development",
    description: "Concept, layout, materials and visual direction.",
  },
  {
    title: "Space Planning",
    description: "Optimizing flow, proportion and usability.",
  },
  {
    title: "Material Selection",
    description: "Selecting finishes and materials.",
  },
  {
    title: "Project Management",
    description: "Managing execution and coordination.",
  },
  {
    title: "Quality Assurance",
    description: "Maintaining standards throughout execution.",
  },
  {
    title: "Final Reveal",
    description: "Walkthrough and handover.",
  },
] as const;

export function TurnkeyProcess() {
  const containerRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Array<HTMLDivElement | null>>([]);
  const numberRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const contentRefs = useRef<Array<HTMLDivElement | null>>([]);
  const activated = useRef<boolean[]>(STEPS.map(() => false));

  useEffect(() => {
    const container = containerRef.current;
    const fill = fillRef.current;
    if (!container || !fill) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      gsap.set(fill, { scaleY: 1 });
      contentRefs.current.forEach((el) => el && gsap.set(el, { opacity: 1, rotateY: 0, z: 0 }));
      numberRefs.current.forEach((el) => {
        if (el) el.style.color = "var(--accent-gold)";
      });
      nodeRefs.current.forEach((el) => {
        if (el) {
          el.style.borderColor = "var(--accent-gold)";
          el.style.backgroundColor = "var(--accent-gold)";
        }
      });
      return;
    }

    // Content pieces start flipped away in 3D — the line "reaching" a
    // step is what flips it into place, so the path and the reveal
    // read as one connected motion rather than independent animations.
    contentRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.set(el, { opacity: 0, rotateY: i % 2 === 0 ? -60 : 60, z: -160 });
    });

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: container,
        start: "top 70%",
        end: "bottom 60%",
        scrub: 0.5,
        onUpdate: (self) => {
          gsap.set(fill, { scaleY: self.progress });
          const activeIndex = Math.min(
            STEPS.length - 1,
            Math.floor(self.progress * STEPS.length)
          );

          numberRefs.current.forEach((el, i) => {
            if (el) el.style.color = i <= activeIndex ? "var(--accent-gold)" : "var(--ink-faint)";
          });

          nodeRefs.current.forEach((el, i) => {
            if (!el) return;
            const lit = i <= activeIndex;
            el.style.borderColor = lit ? "var(--accent-gold)" : "var(--line)";
            el.style.backgroundColor = lit ? "var(--accent-gold)" : "transparent";
          });

          for (let i = 0; i <= activeIndex; i++) {
            if (activated.current[i]) continue;
            activated.current[i] = true;

            const content = contentRefs.current[i];
            if (content) {
              gsap.to(content, { opacity: 1, rotateY: 0, z: 0, duration: 0.85, ease: "power3.out" });
            }
            const node = nodeRefs.current[i];
            if (node) {
              gsap.fromTo(node, { scale: 0.5 }, { scale: 1, duration: 0.5, ease: "back.out(2.5)" });
            }
          }
        },
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <section id="process" className="bg-surface-alt px-5 py-28 sm:px-8 sm:py-36 lg:px-12 lg:py-44">
      <div className="mx-auto max-w-[1600px]">
        <Reveal>
          <p className="label mb-8 text-ink-faint">The Process</p>
          <h2 className="max-w-2xl font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.05] text-ink">
            From idea to reality.
          </h2>
        </Reveal>

        <div
          ref={containerRef}
          className="relative mx-auto mt-20 max-w-3xl"
          style={{ perspective: "1800px" }}
        >
          {/* Path track + scroll-drawn gold fill */}
          <div className="absolute left-5 top-2 bottom-2 w-px -translate-x-1/2 bg-line lg:left-1/2" />
          <div
            ref={fillRef}
            className="absolute left-5 top-2 bottom-2 w-px -translate-x-1/2 origin-top bg-gold lg:left-1/2"
            style={{ transform: "translateX(-50%) scaleY(0)" }}
          />

          <ol className="flex flex-col gap-14 sm:gap-16">
            {STEPS.map((step, i) => {
              const isEven = i % 2 === 0;
              return (
                <li
                  key={step.title}
                  className="relative grid grid-cols-[40px_1fr] items-start gap-5 sm:gap-6 lg:grid-cols-[1fr_40px_1fr] lg:items-center lg:gap-10"
                >
                  {/* Node on the path — centered in a track matching the
                      line's fixed left-5 / left-1/2 position exactly, so
                      it never drifts off the line at any breakpoint. */}
                  <div
                    ref={(el) => {
                      nodeRefs.current[i] = el;
                    }}
                    aria-hidden
                    className="relative z-10 mx-auto mt-1.5 h-3 w-3 shrink-0 rounded-full border-2 transition-colors duration-500 lg:col-start-2 lg:mt-0"
                    style={{ borderColor: "var(--line)", backgroundColor: "transparent" }}
                  />

                  {/* Step content — flips into place as the path reaches its node */}
                  <div
                    ref={(el) => {
                      contentRefs.current[i] = el;
                    }}
                    style={{ opacity: 0, transformStyle: "preserve-3d" }}
                    className={isEven ? "lg:col-start-1 lg:pr-2 lg:text-right" : "lg:col-start-3 lg:pl-2"}
                  >
                    <span
                      ref={(el) => {
                        numberRefs.current[i] = el;
                      }}
                      className="label text-sm font-semibold text-gold transition-colors duration-300"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-2 font-display text-2xl font-medium text-ink sm:text-3xl">{step.title}</h3>
                    <p
                      className={`mt-2 max-w-md text-base sm:text-lg leading-relaxed text-ink-soft font-normal ${
                        isEven ? "lg:ml-auto" : ""
                      }`}
                    >
                      {step.description}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
