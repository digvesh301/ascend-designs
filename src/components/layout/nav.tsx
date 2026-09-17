"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { navLinks, siteConfig } from "@/lib/site-config";
import { ThemeSwitch } from "@/components/ui/theme-switch";
import { useTheme } from "@/components/providers/theme-provider";
import { ProjectInquiryModal } from "@/components/ui/project-inquiry-modal";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === "/";
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Invalidate any 308 redirects that the browser may have cached in disk cache
  useEffect(() => {
    const routesToClear = ["/about", "/services", "/faq", "/contact"];
    routesToClear.forEach((r) => {
      fetch(r, { cache: "reload", method: "HEAD" }).catch(() => {});
    });
  }, []);

  function handleNavClick(
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) {
    setMenuOpen(false);
    if (pathname === href) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
  }

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const docHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        setScrollProgress(
          docHeight > 0 ? (currentScrollY / docHeight) * 100 : 0
        );
        setScrolled(currentScrollY > 40);

        // Smart auto-hide: only hide when scrolling down past 140px and not at bottom
        if (currentScrollY > 140 && currentScrollY > lastScrollY + 8) {
          setHidden(true);
        } else if (currentScrollY < lastScrollY - 6 || currentScrollY <= 60) {
          setHidden(false);
        }

        lastScrollY = currentScrollY;
        ticking = false;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const isNavHidden = hidden && !menuOpen;

  const mobileMenuOverlay = mounted ? (
    createPortal(
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation Menu"
        className={`fixed inset-0 z-[990] flex flex-col justify-between overflow-y-auto px-6 sm:px-10 pt-28 pb-10 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:hidden ${
          menuOpen
            ? "pointer-events-auto opacity-100 translate-y-0"
            : "pointer-events-none opacity-0 -translate-y-4"
        }`}
        style={{
          backgroundColor: theme === "light" ? "#faf8f4" : "#0c0b09",
          color: "var(--ink)",
        }}
      >
        {/* Subtle ambient gold radial background */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-20 -right-20 h-80 w-80 rounded-full bg-gold/10 blur-3xl"
        />

        <nav className="relative z-10 flex flex-col divide-y divide-[var(--line)]" aria-label="Mobile Navigation">
          {navLinks.map((link, i) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                prefetch={false}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`group flex items-center justify-between py-4 font-display text-[1.875rem] sm:text-[2.25rem] font-light leading-tight transition-all duration-300 ${
                  isActive ? "text-gold pl-2" : "text-[var(--ink)] hover:text-gold hover:pl-2"
                }`}
                style={{
                  transitionDelay: menuOpen ? `${i * 45}ms` : "0ms",
                }}
              >
                <span className="flex items-center gap-3">
                  {isActive && (
                    <span className="h-2 w-2 rounded-full bg-gold shadow-[0_0_8px_#c9a96e]" />
                  )}
                  {link.label}
                </span>
                <span
                  aria-hidden
                  className={`text-sm tracking-widest text-gold/80 transition-transform duration-300 group-hover:translate-x-1 ${
                    isActive ? "opacity-100" : "opacity-40 group-hover:opacity-100"
                  }`}
                >
                  ↗
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="relative z-10 flex flex-col gap-5 pt-6 border-t border-[var(--line)] mt-4">
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              setInquiryOpen(true);
            }}
            className="flex items-center justify-center gap-2.5 border border-gold/50 bg-gold/10 py-3.5 text-center text-xs tracking-[0.2em] uppercase font-medium text-gold transition-all duration-300 hover:bg-gold hover:text-black cursor-pointer shadow-[0_0_20px_rgba(201,169,110,0.15)]"
          >
            <span>Start a Project</span>
            <span aria-hidden>→</span>
          </button>

          <div className="flex items-center justify-between pt-2">
            <ThemeSwitch tone="light" />
            <a
              href={siteConfig.phoneHref}
              className="label text-[0.75rem] text-[var(--ink-soft)] transition-colors hover:text-gold"
            >
              {siteConfig.phone}
            </a>
          </div>
        </div>
      </div>,
      document.body
    )
  ) : null;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[1000] transition-[transform,background-color,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isNavHidden ? "-translate-y-full" : "translate-y-0"
        }`}
        style={{
          borderBottom: menuOpen
            ? "1px solid transparent"
            : scrolled || !isHomePage
            ? "1px solid var(--line)"
            : "1px solid transparent",
          backgroundColor: menuOpen
            ? "transparent"
            : scrolled || !isHomePage
            ? theme === "light"
              ? "rgba(250, 248, 244, 0.88)"
              : "rgba(12, 11, 9, 0.85)"
            : "transparent",
          backdropFilter: menuOpen
            ? "none"
            : scrolled || !isHomePage
            ? "blur(16px)"
            : "none",
          boxShadow: menuOpen
            ? "none"
            : scrolled || !isHomePage
            ? "0 10px 30px -10px rgba(0,0,0,0.35)"
            : "none",
        }}
      >
        <div
          className={`mx-auto flex max-w-[1600px] items-center justify-between px-6 transition-[padding] duration-500 sm:px-10 lg:px-16 ${
            scrolled ? "py-3 sm:py-3.5" : "py-5 sm:py-6"
          }`}
        >
          {/* Official Brand Logo */}
          <Link
            href="/"
            className="group relative z-10 flex items-center"
            aria-label="Ascend Designs - Home"
            onClick={() => setMenuOpen(false)}
          >
            <div className="relative h-[30px] w-[124px] overflow-hidden transition-transform duration-300 ease-out group-hover:scale-[1.03] sm:h-8 sm:w-[132px] md:h-9 md:w-[149px]">
              {/* Dark surface / hero logo */}
              <Image
                src="/ascend-logo-dark.png"
                alt="Ascend Designs"
                fill
                priority
                sizes="(max-width: 640px) 124px, 149px"
                className={`object-contain transition-opacity duration-300 ${
                  !scrolled && isHomePage && !menuOpen
                    ? "opacity-100"
                    : theme === "light"
                    ? "opacity-0"
                    : "opacity-100"
                }`}
              />
              {/* Light surface logo */}
              <Image
                src="/ascend-logo.png"
                alt="Ascend Designs"
                fill
                priority
                sizes="(max-width: 640px) 124px, 149px"
                className={`object-contain transition-opacity duration-300 ${
                  !scrolled && isHomePage && !menuOpen
                    ? "opacity-0"
                    : theme === "light"
                    ? "opacity-100"
                    : "opacity-0"
                }`}
              />
              {/* Interactive gold sheen sweep on hover */}
              <span
                aria-hidden
                className="logo-sheen pointer-events-none absolute inset-y-0 -left-full w-full opacity-0"
                style={{
                  background:
                    "linear-gradient(105deg, transparent 25%, rgba(201,169,110,0.65) 50%, transparent 75%)",
                }}
              />
            </div>
          </Link>

          {/* Desktop nav */}
          <nav
            className="hidden items-center gap-8 lg:flex xl:gap-10"
            aria-label="Primary"
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch={false}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`group relative py-1 text-xs font-semibold tracking-[0.15em] uppercase transition-colors duration-300 ${
                    isActive ? "text-gold" : "text-white/90 hover:text-gold"
                  }`}
                >
                  <span className="relative z-10 inline-block transition-transform duration-300 group-hover:-translate-y-0.5">
                    {link.label}
                  </span>

                  {/* Active indicator dot */}
                  {isActive && (
                    <span className="absolute -left-2.5 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-gold shadow-[0_0_8px_#d4af37]" />
                  )}

                  {/* Sliding underline */}
                  <span
                    className={`absolute bottom-0 left-0 h-[1.5px] bg-gold transition-all duration-300 ease-out ${
                      isActive
                        ? "w-full opacity-100"
                        : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Desktop actions */}
          <div className="hidden items-center gap-6 lg:flex xl:gap-8">
            <ThemeSwitch tone="light" />
            <button
              type="button"
              onClick={() => setInquiryOpen(true)}
              className="group relative inline-flex items-center gap-2.5 overflow-hidden border border-gold/50 bg-gold/10 px-6 py-2.5 text-xs font-semibold tracking-[0.16em] uppercase text-gold backdrop-blur-sm transition-all duration-300 hover:border-gold hover:bg-gold hover:text-black hover:shadow-[0_0_20px_rgba(212,175,55,0.25)] cursor-pointer"
            >
              {/* Shimmer sweep highlight */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 -left-full w-full bg-gradient-to-r from-transparent via-gold/30 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[250%]"
              />
              <span className="relative z-10">Start a Project</span>
              <span
                aria-hidden
                className="relative z-10 transition-transform duration-300 ease-out group-hover:translate-x-1"
              >
                →
              </span>
            </button>
          </div>

          {/* Animated Hamburger Button */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="group relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-full border border-white/10 transition-colors hover:border-gold/50 lg:hidden cursor-pointer"
          >
            <span
              className={`h-[1.5px] w-5 bg-ink transition-all duration-300 ease-out ${
                menuOpen ? "translate-y-[4.5px] rotate-45 bg-gold" : ""
              }`}
            />
            <span
              className={`h-[1.5px] w-5 bg-ink transition-all duration-300 ease-out ${
                menuOpen ? "-translate-y-[3px] -rotate-45 bg-gold" : ""
              }`}
            />
          </button>
        </div>

        {/* Scroll Progress Hairline */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 h-[1.5px] bg-gradient-to-r from-transparent via-gold to-transparent transition-opacity duration-300"
          style={{
            width: `${scrollProgress}%`,
            opacity: scrolled && !menuOpen ? 0.85 : 0,
          }}
        />
      </header>

      {/* Portalled Mobile Fullscreen Overlay */}
      {mobileMenuOverlay}

      {/* Project Inquiry Modal */}
      <ProjectInquiryModal
        open={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
      />
    </>
  );
}

