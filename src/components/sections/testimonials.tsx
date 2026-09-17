"use client";

import { useEffect, useState } from "react";
import { Reveal } from "@/components/motion/reveal";

// Real client reviews from Ascend Designs' Google Business listing.
// Quotes truncated by Google's "… More" are cut at the last complete
// sentence rather than guessed at; grammar lightly cleaned where noted.
const TESTIMONIALS = [
  {
    quote:
      "I had a great experience working with Ascend Designs for my home interiors. Their team is highly professional, creative, and attentive to detail. They took the time to understand my preferences and lifestyle…",
    author: "Kishan Patel",
    role: "Homeowner",
    project: "Home Interior",
    location: "Google Review",
    rating: 5,
  },
  {
    quote:
      "We are extremely delighted with our new showroom designed by Ascend Designs. The team perfectly understood our vision and transformed it into a modern, functional, and luxurious space that highlights our products beautifully.",
    author: "Harsh Patel",
    role: "Showroom Owner",
    project: "Retail Showroom",
    location: "Google Review",
    rating: 5,
  },
  {
    quote:
      "One of the best interior designers in Gujarat — creative and unique designs by Ashish sir, always a prompt response. Our dream office came through with his help. Thanks a lot!",
    author: "Meet H Shah",
    role: "Business Owner",
    project: "Office Interior",
    location: "Google Review",
    rating: 5,
  },
  {
    quote:
      "Very good experience — I did my house interior with Ascend Designs and I'm fully satisfied with their work. Their responsive nature helps in every field, and I feel lucky to have found Ascend Designs.",
    author: "Shaurya Harde",
    role: "Homeowner",
    project: "House Interior",
    location: "Google Review",
    rating: 5,
  },
  {
    quote:
      "Working with Ascend Designs for my optical shop interiors was an outstanding experience. Their creativity, attention to detail, and understanding of functional retail design truly brought my vision to life.",
    author: "Rajdeep Bahel",
    role: "Business Owner",
    project: "Optical Shop Interior",
    location: "Google Review",
    rating: 5,
  },
  {
    quote: "Best interior designer in Mehsana — creative and budget-friendly designs by Ashish sir.",
    author: "Sumit Prajapati",
    role: "Client",
    project: "Interior Design",
    location: "Mehsana, Gujarat · Google Review",
    rating: 5,
  },
];

const AUTOPLAY_MS = 6000;

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);

  function go(delta: number) {
    setDirection(delta > 0 ? 1 : -1);
    setIndex((c) => (c + delta + TESTIMONIALS.length) % TESTIMONIALS.length);
  }

  function goTo(i: number) {
    setDirection(i > index ? 1 : -1);
    setIndex(i);
  }

  // Auto-advance, paused on hover and skipped entirely under reduced motion.
  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => go(1), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [index, paused]);

  const current = TESTIMONIALS[index];

  return (
    <section className="relative overflow-hidden border-t border-line bg-surface-alt py-28 sm:py-36 lg:py-44">
      {/* Section number */}
      <span
        aria-hidden
        className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 select-none font-display text-[22vw] leading-none text-white/[0.025]"
      >
        04
      </span>

      <div className="relative mx-auto max-w-[1600px] px-6 sm:px-12 lg:px-20">
        {/* Header */}
        <Reveal>
          <div className="mb-8 flex items-center gap-5">
            <span className="h-px w-10 bg-gold/50" />
            <p className="label text-gold/80">Client Experiences</p>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div
            className="grid grid-cols-1 gap-10 lg:grid-cols-12"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {/* Large quote mark */}
            <div className="lg:col-span-1">
              <span
                key={index}
                className="block font-display text-[6rem] leading-none text-gold/20 select-none"
                style={{ animation: "quotePulse 0.6s cubic-bezier(0.16,1,0.3,1) both" }}
              >
                &ldquo;
              </span>
            </div>

            {/* Quote body */}
            <div className="lg:col-span-9 overflow-hidden">
              {/* Stars */}
              <div className="mb-6 flex gap-1 text-gold" aria-label={`${current.rating} stars`}>
                {Array.from({ length: current.rating }).map((_, i) => (
                  <span
                    key={`${index}-${i}`}
                    className="text-sm"
                    style={{
                      animation: "starPop 0.4s cubic-bezier(0.34,1.56,0.64,1) both",
                      animationDelay: `${i * 60}ms`,
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>

              {/* Quote text */}
              <blockquote
                key={index}
                className="font-display text-[clamp(1.5rem,3.5vw,2.75rem)] font-medium italic leading-[1.35] text-ink drop-shadow-sm"
                style={{
                  animation: `${direction > 0 ? "slideInRight" : "slideInLeft"} 0.55s cubic-bezier(0.16,1,0.3,1) both`,
                }}
              >
                &ldquo;{current.quote}&rdquo;
              </blockquote>

              {/* Attribution */}
              <div className="mt-10 flex flex-col gap-1 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-display text-xl font-medium text-ink">{current.author}</p>
                  <p className="label mt-1 text-gold text-xs font-semibold">
                    {current.role} — {current.project}
                  </p>
                  <p className="mt-1 text-sm text-ink-faint font-medium">{current.location}</p>
                </div>

                {/* Navigation */}
                <div className="flex items-center gap-6 sm:flex-col sm:items-end">
                  {/* Dots — active one fills as a progress bar toward the next auto-advance */}
                  <div className="flex gap-2">
                    {TESTIMONIALS.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => goTo(i)}
                        aria-label={`Go to slide ${i + 1}`}
                        className={`relative h-1 overflow-hidden rounded-none transition-[width,background-color] duration-300 ${
                          index === i ? "w-8 bg-ink-faint/20" : "w-2 bg-ink-faint/40 hover:bg-ink-faint"
                        }`}
                      >
                        {index === i && (
                          <span
                            aria-hidden
                            className="absolute inset-y-0 left-0 bg-gold"
                            style={{
                              animation: `dotFill ${AUTOPLAY_MS}ms linear forwards`,
                              animationPlayState: paused ? "paused" : "running",
                            }}
                          />
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Arrows */}
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => go(-1)}
                      aria-label="Previous"
                      className="label border border-line px-4 py-2 text-ink-soft transition-colors hover:border-gold/40 hover:text-gold"
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      onClick={() => go(1)}
                      aria-label="Next"
                      className="label border border-line px-4 py-2 text-ink-soft transition-colors hover:border-gold/40 hover:text-gold"
                    >
                      →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(24px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-24px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes dotFill {
          from { width: 0%; }
          to   { width: 100%; }
        }
        @keyframes quotePulse {
          from { opacity: 0; transform: scale(0.7); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes starPop {
          from { opacity: 0; transform: scale(0.4); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </section>
  );
}
