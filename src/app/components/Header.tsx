"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

/** Teaser block: heading, short description, link, and optional image (placeholder for now). */
type Teaser = { title: string; desc: string; href: string };

type MegaConfig = {
  sectionTitle: string;
  leftLinks: { label: string; href: string }[];
  /** One or two teaser blocks (title + desc + image placeholder), shown in middle/right columns. */
  teasers: [Teaser] | [Teaser, Teaser];
};

const MEGA_CARE: MegaConfig = {
  sectionTitle: "CARE",
  leftLinks: [
    { label: "Care overview", href: "/care" },
    { label: "The 360° evaluation", href: "/care/360-evaluation" },
    { label: "Ongoing care", href: "/care/ongoing-care" },
    { label: "Everyday wellness", href: "/care/everyday-wellness" },
  ],
  teasers: [
    { title: "The 360° evaluation", desc: "A comprehensive look at how you move.", href: "/care/360-evaluation" },
    { title: "Ongoing care", desc: "Steady support after your evaluation.", href: "/care/ongoing-care" },
  ],
};

const MEGA_FIRST_VISIT: MegaConfig = {
  sectionTitle: "FIRST VISIT",
  leftLinks: [
    { label: "What to expect", href: "/first-visit#what-to-expect" },
    { label: "FAQs", href: "/first-visit#faqs" },
  ],
  teasers: [
    { title: "What to expect", desc: "Comprehensive and unhurried.", href: "/first-visit#what-to-expect" },
    { title: "FAQs", desc: "Common questions about your first visit.", href: "/first-visit#faqs" },
  ],
};

const MEGA_ABOUT: MegaConfig = {
  sectionTitle: "ABOUT",
  leftLinks: [
    { label: "About us", href: "/about" },
    { label: "Your care team", href: "/about/care-team" },
  ],
  teasers: [
    { title: "About us", desc: "Exceptional care made common.", href: "/about" },
    { title: "Your care team", desc: "The people behind your care.", href: "/about/care-team" },
  ],
};

const MEGA_INSURANCE: MegaConfig = {
  sectionTitle: "INSURANCE",
  leftLinks: [
    { label: "How it works", href: "/insurance" },
    { label: "Deductible basics", href: "/insurance#deductible" },
    { label: "FAQ", href: "/insurance#faq" },
  ],
  teasers: [
    { title: "Eligibility check", href: "/insurance#eligibility", desc: "Submit your info. We'll follow up within 24 hours." },
  ],
};

type DropdownId = "care" | "first-visit" | "about" | "insurance" | null;

const SCROLL_THRESHOLD = 56;

export default function Header() {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<DropdownId>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState<DropdownId>(null);
  const [scrolled, setScrolled] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Default to home style until pathname is known (avoids white bar flash on load)
  const isHome = pathname === "/" || pathname === null;

  const isDropdownItem = (id: DropdownId) => (id === "care" || id === "first-visit" || id === "about" || id === "insurance");

  const handleEnter = (id: DropdownId) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenDropdown(id);
  };

  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setOpenDropdown(null), 120);
  };

  const handleLeavePanel = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setOpenDropdown(null), 120);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Sticky nav: seamless background transition on scroll (home only)
  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll(); // set initial
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  const onLightBg = !isHome || (isHome && scrolled);
  const navClass = onLightBg ? "text-darkgreen" : "text-white";
  const ctaClass = onLightBg
    ? "bg-matcha text-light-green hover:opacity-95"
    : "bg-white/15 backdrop-blur-sm border border-white/20 text-white hover:bg-white/25";

  const renderMegaPanel = (id: DropdownId) => {
    if (!id) return null;
    const config =
      id === "care"
        ? MEGA_CARE
        : id === "first-visit"
          ? MEGA_FIRST_VISIT
          : id === "about"
            ? MEGA_ABOUT
            : MEGA_INSURANCE;
    const onHero = isHome && !scrolled;
    const dropdownText = onHero ? "text-[#8A976F]" : "text-forest";
    const linkBase = "font-medium inline-block w-fit border-b border-transparent hover:border-current transition-colors";
    const ruleColor = onHero ? "border-[#8A976F]/30" : "border-forest/30";
    const placeholderBg = onHero ? "bg-white/10" : "bg-darkgreen/10";

    return (
      <div
        className={`w-full h-[330px] flex flex-col ${onHero ? "border-t border-white/10 bg-darkgreen" : "border-t-0 bg-white"}`}
        onMouseEnter={() => handleEnter(id)}
        onMouseLeave={handleLeavePanel}
      >
        <div className="w-full flex-1 px-16 py-8 flex flex-col min-h-0">
          {/* Section title: Geist Mono, 14px, olive */}
          <p className="font-mono text-[14px] font-medium tracking-[0.22em] uppercase text-[#8A976F]">
            {config.sectionTitle}
          </p>
          {/* Horizontal rule: full width; vertical line below connects to this */}
          <div className={`mt-3 border-b ${ruleColor} w-full`} aria-hidden />
          {/* Grid: vertical line runs top-to-bottom (connects to rule); nav + teasers have 32px top padding */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1px_1fr_1fr] gap-x-0 md:gap-x-8 gap-y-8 flex-1 min-h-0">
            {/* Left: nav links (display font), 32px below rule */}
            <nav className="min-w-0 flex flex-col gap-3 pt-8 md:pt-8 font-hero-display" aria-label={`${config.sectionTitle} links`}>
              {config.leftLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-[20px] ${dropdownText} ${linkBase}`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            {/* Vertical line: full height from top (touches horizontal) to bottom */}
            <div className="hidden md:block relative min-w-0 w-px shrink-0">
              <div
                className={`absolute inset-y-0 left-0 w-px ${onHero ? "bg-white/20" : "bg-forest/20"}`}
                aria-hidden
              />
            </div>
            {/* First teaser: 32px below rule, extra left padding to sit further right; 32px gap to next teaser */}
            <div className="min-w-0 flex flex-col pt-8 md:pt-8 md:pl-16">
              {config.teasers[0] && (
                <Link href={config.teasers[0].href} className="block group flex flex-col">
                  <span className={`text-[16px] font-normal ${dropdownText}`}>{config.teasers[0].title}</span>
                  <span className={`mt-1 block text-[14px] font-normal ${dropdownText} opacity-90`}>
                    {config.teasers[0].desc}
                  </span>
                  <div
                    className={`mt-4 w-[130px] h-[130px] shrink-0 ${placeholderBg}`}
                    aria-hidden
                  />
                </Link>
              )}
            </div>
            {/* Second teaser: 32px apart from first (grid gap handles it), no extra pl */}
            <div className="min-w-0 flex flex-col pt-8 md:pt-8 md:pl-0">
              {config.teasers[1] ? (
                <Link href={config.teasers[1].href} className="block group flex flex-col">
                  <span className={`text-[16px] font-normal ${dropdownText}`}>{config.teasers[1].title}</span>
                  <span className={`mt-1 block text-[14px] font-normal ${dropdownText} opacity-90`}>
                    {config.teasers[1].desc}
                  </span>
                  <div
                    className={`mt-4 w-[130px] h-[130px] shrink-0 ${placeholderBg}`}
                    aria-hidden
                  />
                </Link>
              ) : (
                <div className="w-[130px] h-[130px] shrink-0" aria-hidden />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 ${!isHome ? "bg-white border-b border-matcha/5" : ""}`}
        onMouseLeave={handleLeave}
      >
        {/* Main nav bar — on home: transparent until scroll; background layer fades in via opacity */}
        <div className="relative z-20 w-full px-16 py-2">
          {isHome && (
            <div
              className={`absolute inset-0 pointer-events-none nav-scroll-bg backdrop-blur-sm border-b border-matcha/5 transition-opacity duration-[950ms] ease-[cubic-bezier(0.22,0,0.2,1)] ${
                scrolled ? "opacity-100" : "opacity-0"
              }`}
              aria-hidden
            />
          )}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center">
              <Link
                href="/"
                className={`flex items-center ${navClass}`}
                aria-label="Common Care — Home"
              >
                <Image
                  src={isHome && !onLightBg ? "/CommonCare_Logo_White.svg" : "/CommonCare_Logo_DarkGreen.svg"}
                  alt="Common Care"
                  width={360}
                  height={194}
                  className="h-14 w-auto md:h-16 transition-opacity duration-[950ms] ease-[cubic-bezier(0.22,0,0.2,1)]"
                  priority
                />
              </Link>

              {/* Desktop nav — 40px from logo */}
              <nav className="hidden md:flex items-center gap-1 ml-10">
                <div
                  className="relative"
                  onMouseEnter={() => handleEnter("care")}
                >
                  <Link
                    href="/care"
                    className={`flex items-center px-4 py-2 h-9 text-base leading-6 ${navClass} opacity-90 hover:opacity-100 rounded-md`}
                  >
                    Care
                  </Link>
                </div>
                <div
                  className="relative"
                  onMouseEnter={() => handleEnter("first-visit")}
                >
                  <Link
                    href="/first-visit"
                    className={`flex items-center px-4 py-2 h-9 text-base leading-6 ${navClass} opacity-90 hover:opacity-100 rounded-md`}
                  >
                    First Visit
                  </Link>
                </div>
                <div
                  className="relative"
                  onMouseEnter={() => handleEnter("about")}
                >
                  <Link
                    href="/about"
                    className={`flex items-center px-4 py-2 h-9 text-base leading-6 ${navClass} opacity-90 hover:opacity-100 rounded-md`}
                  >
                    About
                  </Link>
                </div>
                <div
                  className="relative"
                  onMouseEnter={() => handleEnter("insurance")}
                >
                  <Link
                    href="/insurance"
                    className={`flex items-center px-4 py-2 h-9 text-base leading-6 ${navClass} opacity-90 hover:opacity-100 rounded-md`}
                  >
                    Insurance
                  </Link>
                </div>
              </nav>
            </div>

            <Link
              href="/book"
              className={`hidden md:inline-flex rounded-full px-4 py-2 text-base font-medium ${ctaClass}`}
            >
Book an evaluation
              </Link>

            {/* Mobile: menu button */}
            <div className="flex items-center gap-3 md:hidden">
              <Link
                href="/book"
                className={`rounded-full px-4 py-2 text-base font-medium ${ctaClass}`}
              >
                Book an evaluation
              </Link>
              <button
                type="button"
                onClick={() => setMobileOpen(!mobileOpen)}
                className={`p-2 rounded-lg ${navClass} opacity-90`}
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Desktop mega dropdown — only when hovering; motion: opacity + slight translate */}
        {openDropdown && isDropdownItem(openDropdown) && (
          <div
            className="absolute left-0 right-0 top-full z-10 nav-dropdown-panel"
            style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.06)" }}
          >
            {renderMegaPanel(openDropdown)}
          </div>
        )}
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden bg-bone/95 backdrop-blur-sm pt-24 px-16 pb-12 overflow-auto"
          role="dialog"
          aria-label="Menu"
        >
          <div className="flex flex-col gap-2">
            {/* Care accordion */}
            <div>
              <button
                type="button"
                onClick={() => setMobileAccordion(mobileAccordion === "care" ? null : "care")}
                className="flex w-full items-center justify-between py-3 text-left text-darkgreen font-medium"
              >
                Care
                <span className="text-lg">{mobileAccordion === "care" ? "−" : "+"}</span>
              </button>
              {mobileAccordion === "care" && (
                <div className="pl-4 pb-4 flex flex-col gap-2">
                  {MEGA_CARE.leftLinks.map((l) => (
                    <Link key={l.href} href={l.href} className="text-darkgreen/80 text-sm py-1" onClick={() => setMobileOpen(false)}>
                      {l.label}
                    </Link>
                  ))}
                  {MEGA_CARE.teasers.map((t) => (
                    <Link key={t.href} href={t.href} className="text-darkgreen/80 text-sm py-1" onClick={() => setMobileOpen(false)}>
                      {t.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            {/* First Visit accordion */}
            <div>
              <button
                type="button"
                onClick={() => setMobileAccordion(mobileAccordion === "first-visit" ? null : "first-visit")}
                className="flex w-full items-center justify-between py-3 text-left text-darkgreen font-medium"
              >
                First Visit
                <span className="text-lg">{mobileAccordion === "first-visit" ? "−" : "+"}</span>
              </button>
              {mobileAccordion === "first-visit" && (
                <div className="pl-4 pb-4 flex flex-col gap-2">
                  {MEGA_FIRST_VISIT.leftLinks.map((l) => (
                    <Link key={l.href} href={l.href} className="text-darkgreen/80 text-sm py-1" onClick={() => setMobileOpen(false)}>
                      {l.label}
                    </Link>
                  ))}
                  {MEGA_FIRST_VISIT.teasers.map((t) => (
                    <Link key={t.href} href={t.href} className="text-darkgreen/80 text-sm py-1" onClick={() => setMobileOpen(false)}>
                      {t.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            {/* About accordion */}
            <div>
              <button
                type="button"
                onClick={() => setMobileAccordion(mobileAccordion === "about" ? null : "about")}
                className="flex w-full items-center justify-between py-3 text-left text-darkgreen font-medium"
              >
                About
                <span className="text-lg">{mobileAccordion === "about" ? "−" : "+"}</span>
              </button>
              {mobileAccordion === "about" && (
                <div className="pl-4 pb-4 flex flex-col gap-2">
                  {MEGA_ABOUT.leftLinks.map((l) => (
                    <Link key={l.href} href={l.href} className="text-darkgreen/80 text-sm py-1" onClick={() => setMobileOpen(false)}>
                      {l.label}
                    </Link>
                  ))}
                  {MEGA_ABOUT.teasers.map((t) => (
                    <Link key={t.href} href={t.href} className="text-darkgreen/80 text-sm py-1" onClick={() => setMobileOpen(false)}>
                      {t.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            {/* Insurance accordion */}
            <div>
              <button
                type="button"
                onClick={() => setMobileAccordion(mobileAccordion === "insurance" ? null : "insurance")}
                className="flex w-full items-center justify-between py-3 text-left text-darkgreen font-medium"
              >
                Insurance
                <span className="text-lg">{mobileAccordion === "insurance" ? "−" : "+"}</span>
              </button>
              {mobileAccordion === "insurance" && (
                <div className="pl-4 pb-4 flex flex-col gap-2">
                  {MEGA_INSURANCE.leftLinks.map((l) => (
                    <Link key={l.href} href={l.href} className="text-darkgreen/80 text-sm py-1" onClick={() => setMobileOpen(false)}>
                      {l.label}
                    </Link>
                  ))}
                  {MEGA_INSURANCE.teasers.map((t) => (
                    <Link key={t.href} href={t.href} className="text-darkgreen/80 text-sm py-1" onClick={() => setMobileOpen(false)}>
                      {t.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
