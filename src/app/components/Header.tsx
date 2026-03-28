"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  Bars3Icon,
  XMarkIcon,
  MinusIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";

type MegaConfig = {
  leftLinks: { label: string; href: string }[];
};

const MEGA_CARE: MegaConfig = {
  leftLinks: [
    { label: "Care overview", href: "/care#care-approach" },
    { label: "Care Evaluation", href: "/care#the-360-evaluation" },
    { label: "Care Sessions", href: "/care#the-care-sessions" },
    { label: "Recovery Care", href: "/care#everyday-wellness" },
  ],
};

const MEGA_FIRST_VISIT: MegaConfig = {
  leftLinks: [
    { label: "What to expect", href: "/first-visit#what-to-expect" },
    { label: "FAQs", href: "/first-visit#faqs" },
  ],
};

const MEGA_ABOUT: MegaConfig = {
  leftLinks: [
    { label: "About us", href: "/about#what-we-believe" },
    { label: "Your care team", href: "/about#care-team" },
  ],
};

const MEGA_INSURANCE: MegaConfig = {
  leftLinks: [
    { label: "How it works", href: "/insurance" },
    { label: "Deductible basics", href: "/insurance#deductible" },
    { label: "FAQ", href: "/insurance#faq" },
  ],
};

type DropdownId = "care" | "first-visit" | "about" | "insurance" | null;

const SCROLL_THRESHOLD = 56;

const MOBILE_DRAWER_SUBMENU_LINK =
  "text-[18px] leading-snug py-2 text-white/85";

const MOBILE_DRAWER_HEADING =
  "cc-heading-sm flex w-full items-center justify-between py-3 text-left text-white";

function MobileDrawerAccordionGlyph({ expanded }: { expanded: boolean }) {
  const cls = "h-7 w-7 shrink-0 text-white pointer-events-none";
  return expanded ? (
    <MinusIcon className={cls} strokeWidth={1} aria-hidden />
  ) : (
    <PlusIcon className={cls} strokeWidth={1} aria-hidden />
  );
}

export default function Header() {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<DropdownId>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState<DropdownId>(null);
  const [scrolled, setScrolled] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Default to home style until pathname is known (avoids white bar flash on load)
  const isHome = pathname === "/" || pathname === null;

  const isDropdownItem = (id: DropdownId) => id === "care" || id === "about";

  const handleEnter = (id: DropdownId) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenDropdown(id);
  };

  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setOpenDropdown(null), 180);
  };

  const handleLeavePanel = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setOpenDropdown(null), 180);
  };

  const handleBlurWithin = (
    e: React.FocusEvent<HTMLElement>,
    id: DropdownId
  ) => {
    const next = e.relatedTarget as Node | null;
    if (next && e.currentTarget.contains(next)) return;
    if (openDropdown === id) handleLeave();
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
  const desktopNavColor = onLightBg ? "#1F3414" : "#FFFFFF";
  const ctaClass = onLightBg
    ? "cc-btn-primary"
    : "cc-btn-primary-white";

  const desktopNavLinkClass =
    "nav-link-ltr-underline flex items-center px-4 py-2 h-9 text-base leading-6 opacity-90 hover:opacity-100 rounded-md outline-none";

  const renderContainedDrawer = (id: "care" | "about") => {
    const config = id === "about" ? MEGA_ABOUT : MEGA_CARE;
    const isOpen = openDropdown === id;
    const panelWidth = id === "about" ? "w-[260px]" : "w-[300px]";
    const menuLabel = id === "about" ? "About menu" : "Care menu";
    const linksLabel = id === "about" ? "About links" : "Care links";
    return (
      <div
        role="menu"
        aria-label={menuLabel}
        onMouseEnter={() => handleEnter(id)}
        onMouseLeave={handleLeavePanel}
        onKeyDown={(e) => {
          if (e.key === "Escape") setOpenDropdown(null);
        }}
        className={`absolute left-0 top-full mt-3 ${panelWidth} max-w-[min(90vw,320px)] rounded-[10px] border border-forest/10 bg-bone/50 backdrop-blur-sm shadow-[0_8px_24px_-12px_rgba(31,52,20,0.18)] p-5 transition-[opacity,transform,visibility] duration-220 ease-out ${
          isOpen
            ? "opacity-100 translate-y-0 visible pointer-events-auto"
            : "opacity-0 -translate-y-1 invisible pointer-events-none"
        }`}
      >
        <nav className="flex flex-col gap-2.5" aria-label={linksLabel}>
          {config.leftLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              role="menuitem"
              className="inline-block w-fit font-sans text-sm font-normal leading-normal text-darkgreen border-b border-transparent hover:border-darkgreen/25 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
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
        <div className="relative z-20 w-full px-6 md:px-16 py-2">
          {isHome && (
            <div
              className={`absolute inset-0 pointer-events-none nav-scroll-bg backdrop-blur-sm border-b border-matcha/5 transition-opacity duration-[950ms] ease-[cubic-bezier(0.22,0,0.2,1)] ${
                scrolled ? "opacity-100" : "opacity-0"
              }`}
              aria-hidden
            />
          )}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center shrink-0">
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
                  className="h-10 w-auto shrink-0 sm:h-11 md:h-14 lg:h-16 transition-opacity duration-[950ms] ease-[cubic-bezier(0.22,0,0.2,1)]"
                  priority
                />
              </Link>
            </div>

            {/* Right cluster: desktop nav + CTA; mobile menu button */}
            <div className="flex items-center justify-end gap-2 shrink-0">
              <nav className="hidden md:flex items-center gap-1 mr-2">
                <div
                  className="relative"
                  onMouseEnter={() => handleEnter("care")}
                  onMouseLeave={handleLeavePanel}
                  onFocusCapture={() => handleEnter("care")}
                  onBlurCapture={(e) => handleBlurWithin(e, "care")}
                >
                  <Link
                    href="/care"
                    aria-haspopup="menu"
                    aria-expanded={openDropdown === "care"}
                    className={desktopNavLinkClass}
                    style={{ color: desktopNavColor }}
                  >
                    Care
                  </Link>
                  {renderContainedDrawer("care")}
                </div>
                <Link
                  href="/first-visit"
                  className={desktopNavLinkClass}
                  style={{ color: desktopNavColor }}
                >
                  First Visit
                </Link>
                <div
                  className="relative"
                  onMouseEnter={() => handleEnter("about")}
                  onMouseLeave={handleLeavePanel}
                  onFocusCapture={() => handleEnter("about")}
                  onBlurCapture={(e) => handleBlurWithin(e, "about")}
                >
                  <Link
                    href="/about"
                    aria-haspopup="menu"
                    aria-expanded={openDropdown === "about"}
                    className={desktopNavLinkClass}
                    style={{ color: desktopNavColor }}
                  >
                    About
                  </Link>
                  {renderContainedDrawer("about")}
                </div>
                <Link
                  href="/insurance"
                  className={desktopNavLinkClass}
                  style={{ color: desktopNavColor }}
                >
                  Insurance
                </Link>
              </nav>
              <div className="hidden md:flex items-center">
                <Link href="/book" className={ctaClass}>
                  Book an evaluation
                </Link>
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(!mobileOpen)}
                className={`md:hidden p-2 rounded-lg ${navClass} opacity-90`}
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

      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden flex flex-col bg-darkgreen text-white"
          role="dialog"
          aria-label="Menu"
        >
          <div className="flex-1 overflow-auto pt-24 px-6 pb-6">
          <div className="flex flex-col gap-2">
            {/* Care accordion */}
            <div>
              <button
                type="button"
                onClick={() => setMobileAccordion(mobileAccordion === "care" ? null : "care")}
                className={MOBILE_DRAWER_HEADING}
              >
                Care
                <MobileDrawerAccordionGlyph expanded={mobileAccordion === "care"} />
              </button>
              {mobileAccordion === "care" && (
                <div className="pl-4 pb-4 flex flex-col gap-1">
                  {MEGA_CARE.leftLinks.map((l) => (
                    <Link key={l.href} href={l.href} className={MOBILE_DRAWER_SUBMENU_LINK} onClick={() => setMobileOpen(false)}>
                      {l.label}
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
                className={MOBILE_DRAWER_HEADING}
              >
                First Visit
                <MobileDrawerAccordionGlyph expanded={mobileAccordion === "first-visit"} />
              </button>
              {mobileAccordion === "first-visit" && (
                <div className="pl-4 pb-4 flex flex-col gap-1">
                  {MEGA_FIRST_VISIT.leftLinks.map((l) => (
                    <Link key={l.href} href={l.href} className={MOBILE_DRAWER_SUBMENU_LINK} onClick={() => setMobileOpen(false)}>
                      {l.label}
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
                className={MOBILE_DRAWER_HEADING}
              >
                About
                <MobileDrawerAccordionGlyph expanded={mobileAccordion === "about"} />
              </button>
              {mobileAccordion === "about" && (
                <div className="pl-4 pb-4 flex flex-col gap-1">
                  {MEGA_ABOUT.leftLinks.map((l) => (
                    <Link key={l.href} href={l.href} className={MOBILE_DRAWER_SUBMENU_LINK} onClick={() => setMobileOpen(false)}>
                      {l.label}
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
                className={MOBILE_DRAWER_HEADING}
              >
                Insurance
                <MobileDrawerAccordionGlyph expanded={mobileAccordion === "insurance"} />
              </button>
              {mobileAccordion === "insurance" && (
                <div className="pl-4 pb-4 flex flex-col gap-1">
                  {MEGA_INSURANCE.leftLinks.map((l) => (
                    <Link key={l.href} href={l.href} className={MOBILE_DRAWER_SUBMENU_LINK} onClick={() => setMobileOpen(false)}>
                      {l.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
          </div>
          <div className="shrink-0 px-6 pt-4 pb-[calc(40px+env(safe-area-inset-bottom,0px))]">
            <Link
              href="/book"
              className="cc-btn-primary-white w-full justify-center px-6 py-3.5 text-[17px]"
              onClick={() => setMobileOpen(false)}
            >
              Book an evaluation
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
