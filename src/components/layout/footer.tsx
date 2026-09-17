"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { siteConfig, socialLinks } from "@/lib/site-config";

const marqueeItems = [
  "RESIDENTIAL ARCHITECTURE",
  "LUXURY INTERIORS",
  "TURNKEY EXECUTION",
  "BESPOKE LIVING",
  "COMMERCIAL SPACES",
  "AHMEDABAD & BEYOND",
];

export function Footer() {
  const wrapRef = useRef<HTMLElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [istTime, setIstTime] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const pathname = usePathname();

  // Live IST Clock
  useEffect(() => {
    function updateClock() {
      const now = new Date();
      const formatted = now.toLocaleTimeString("en-US", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
      setIstTime(formatted);
    }
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Scroll depth for circular progress indicator
  useEffect(() => {
    function onScroll() {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress(
          Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100))
        );
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // GSAP scroll-triggered entrance animations with guarantee of visibility on all routes
  useEffect(() => {
    const wrap = wrapRef.current;
    const wordmark = wordmarkRef.current;
    if (!wrap) return;

    // Immediately ensure footer is visible across all routes
    gsap.set(".footer-row", { y: 0, opacity: 1 });
    gsap.set(".footer-line", { scaleX: 1 });
    if (wordmark) gsap.set(wordmark, { yPercent: 0, opacity: 1 });

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduced) return;

    // Refresh ScrollTrigger so coordinates match current page content
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 120);

    const ctx = gsap.context(() => {
      // ── Wordmark watermark reveal ───────────────────────────────
      if (wordmark) {
        gsap.fromTo(
          wordmark,
          { yPercent: 30, opacity: 0.3 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 1.0,
            ease: "power3.out",
            scrollTrigger: { trigger: wrap, start: "top 95%" },
          }
        );
      }

      // ── Row reveal ───────────────────────────────────────────────
      gsap.fromTo(
        ".footer-row",
        { y: 16, opacity: 0.8 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: wrap, start: "top 95%" },
        }
      );

      // ── Divider line draw ────────────────────────────────────────
      gsap.fromTo(
        ".footer-line",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.9,
          ease: "power3.inOut",
          scrollTrigger: { trigger: ".footer-line", start: "top 98%" },
        }
      );
    }, wrap);

    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, [pathname]);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleCopyEmail() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(siteConfig.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  }

  const circumference = 2 * Math.PI * 17;
  const strokeOffset = circumference * (1 - scrollProgress / 100);

  return (
    <footer
      ref={wrapRef}
      className="relative overflow-hidden border-t border-white/[0.08] bg-[#0a0908] text-ink"
    >
      {/* ── 1. Infinite Architectural Ticker (Marquee) ───────────────────── */}
      <div className="border-b border-white/[0.06] bg-white/[0.01] py-3.5 overflow-hidden select-none">
        <div className="animate-marquee flex items-center gap-8">
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, idx) => (
            <div key={idx} className="flex items-center gap-8">
              <span className="label text-[0.5625rem] tracking-[0.26em] text-white/35 transition-colors hover:text-gold">
                {item}
              </span>
              <span className="text-[0.5rem] text-gold/40">✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Background Editorial Ambient Wordmark ────────────────────────── */}
      <div
        ref={wordmarkRef}
        aria-hidden
        className="pointer-events-none absolute right-4 -bottom-6 select-none opacity-0 sm:right-8 lg:right-12"
      >
        <p className="font-display text-[clamp(5rem,14vw,13rem)] font-light leading-none tracking-tighter text-white/[0.03]">
          ASCEND
        </p>
      </div>

      {/* ── Main Footer Body ─────────────────────────────────────────────── */}
      <div className="relative z-10 mx-auto max-w-[1600px] px-6 pt-12 pb-28 sm:px-8 sm:pb-12 lg:px-12">
        {/* ── Brand & Studio Presence ──────────────────────────────────────── */}
        <div className="footer-row flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          {/* Logo & Tagline */}
          <div className="flex flex-col gap-4">
            <Link
              href="/"
              className="group relative inline-flex flex-col"
              aria-label="Ascend Designs - Home"
            >
              <div className="relative h-9 w-[150px] overflow-hidden transition-transform duration-300 ease-out group-hover:scale-[1.03] sm:h-11 sm:w-[182px] md:h-12 md:w-[199px]">
                <Image
                  src="/ascend-logo-dark.png"
                  alt="Ascend Designs"
                  fill
                  sizes="(max-width: 640px) 150px, 199px"
                  className="object-contain"
                />
                {/* Interactive Sheen Sweep */}
                <span
                  aria-hidden
                  className="logo-sheen pointer-events-none absolute inset-y-0 -left-full w-full opacity-0"
                  style={{
                    background:
                      "linear-gradient(105deg, transparent 25%, rgba(201,169,110,0.7) 50%, transparent 75%)",
                  }}
                />
              </div>
              <span className="label mt-2 text-[0.5rem] tracking-[0.28em] text-gold/70">
                {siteConfig.tagline}
              </span>
            </Link>

            <p className="max-w-md text-sm leading-relaxed text-white/80 font-normal">
              Thoughtful residential, commercial, and turnkey architectural
              interiors crafted with material authenticity and spatial clarity.
            </p>
          </div>

          {/* Live Studio Clock & Location Badge */}
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center lg:items-end">
            <div className="flex items-center gap-3 rounded-full border border-white/20 bg-white/[0.04] px-4 py-2 backdrop-blur-sm transition-colors hover:border-gold">
              <span className="relative flex h-2 w-2">
                <span className="status-pulse absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="label text-xs tracking-[0.14em] text-white/90 font-medium">
                Ahmedabad, IN
              </span>
              <span className="text-white/40">•</span>
              <span className="font-mono text-xs tracking-wider text-gold font-semibold">
                {istTime || "10:00 AM"} IST
              </span>
            </div>
          </div>
        </div>

        {/* ── Social Links & Quick Navigation ──────────────────────────────── */}
        <div className="footer-row mt-10 flex flex-wrap items-center justify-between gap-6 border-t border-white/10 pt-6">
          <div className="flex flex-wrap items-center gap-6 sm:gap-8">
            {socialLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative label text-xs tracking-[0.16em] text-white/80 font-semibold transition-colors duration-300 hover:text-gold"
              >
                <span className="inline-block transition-transform duration-300 group-hover:-translate-y-0.5">
                  {s.label.toUpperCase()}
                </span>
                <span className="absolute bottom-0 left-0 h-px w-0 bg-gold transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/contact"
              className="group label inline-flex items-center gap-2 text-xs tracking-[0.16em] text-gold font-semibold hover:text-gold"
            >
              <span>Work with Us</span>
              <span
                aria-hidden
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </div>
        </div>

        {/* ── Divider ──────────────────────────────────────────────────────── */}
        <div
          className="footer-line mt-6 h-px origin-left bg-gradient-to-r from-white/10 via-gold/40 to-white/10"
          style={{ transform: "scaleX(0)" }}
        />

        {/* ── Bottom Bar: Copyright, Contact & Interactive Back-to-Top ─────── */}
        <div className="footer-row mt-6 flex flex-col-reverse items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="label text-xs tracking-[0.14em] text-white/60 font-medium">
            © {new Date().getFullYear()} ASCEND DESIGNS. ALL RIGHTS RESERVED.
          </p>

          <div className="flex flex-wrap items-center gap-6 sm:gap-8">
            {/* Click-to-copy email with animated tooltip */}
            <div className="relative">
              <button
                type="button"
                onClick={handleCopyEmail}
                className="text-xs text-white/50 transition-colors duration-300 hover:text-gold"
                title="Click to copy email address"
              >
                {siteConfig.email}
              </button>
              {copied && (
                <span className="absolute -top-7 left-1/2 -translate-x-1/2 rounded bg-gold px-2 py-0.5 text-[0.625rem] font-semibold text-surface shadow-lg transition-all animate-fade-in">
                  Copied!
                </span>
              )}
            </div>

            <a
              href={siteConfig.phoneHref}
              className="text-xs text-white/50 transition-colors duration-300 hover:text-gold"
            >
              {siteConfig.phone}
            </a>

            {/* Back to Top button with animated SVG circular scroll progress */}
            <button
              type="button"
              onClick={scrollToTop}
              aria-label="Back to top"
              className="group relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.02] text-white/60 backdrop-blur-sm transition-all duration-300 hover:border-gold hover:text-gold hover:shadow-[0_0_15px_rgba(201,169,110,0.3)] hover:-translate-y-0.5"
            >
              {/* Circular Progress SVG */}
              <svg
                className="absolute inset-0 -rotate-90 pointer-events-none"
                width="40"
                height="40"
                viewBox="0 0 40 40"
              >
                <circle
                  cx="20"
                  cy="20"
                  r="17"
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeWidth="1.5"
                  fill="transparent"
                />
                <circle
                  cx="20"
                  cy="20"
                  r="17"
                  stroke="var(--accent-gold)"
                  strokeWidth="1.5"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeOffset}
                  strokeLinecap="round"
                  className="transition-[stroke-dashoffset] duration-150"
                />
              </svg>
              <span
                aria-hidden
                className="text-sm transition-transform duration-300 ease-out group-hover:-translate-y-0.5"
              >
                ↑
              </span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
