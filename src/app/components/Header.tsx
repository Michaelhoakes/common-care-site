"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import SmoothHashLink from "./SmoothHashLink";
import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
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
    { label: "Wellness Care", href: "/care#everyday-wellness" },
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
    { label: "How it works", href: "/insurance#how-it-works" },
    { label: "Insurance basics", href: "/insurance#insurance-basics" },
    { label: "Check your benefits", href: "/insurance#eligibility" },
  ],
};

const MEGA_FIRST_VISIT: MegaConfig = {
  leftLinks: [
    { label: "What to expect", href: "/first-visit#what-to-expect" },
    { label: "How to prepare", href: "/first-visit#how-to-prepare" },
    { label: "Location & parking", href: "/first-visit#parking-arrival" },
    { label: "Insurance & payment", href: "/first-visit#insurance-payment" },
    { label: "FAQs", href: "/first-visit#faqs" },
  ],
};

type MobileAccordionId =
  | "care"
  | "first-visit"
  | "about"
  | "insurance"
  | null;

type DropdownId = "care" | "about" | null;

const SCROLL_THRESHOLD = 56;

/** Geist Mono, 15px, all caps, 8% letter-spacing (0.08em). */
const NAV_LABEL_SIZE = "text-[15px] leading-5";
const NAV_LABEL_TYPO = `font-mono uppercase tracking-[0.08em] ${NAV_LABEL_SIZE}`;

/** Slightly tighter than global .cc-btn-primary / .cc-btn-primary-white (nav only). */
const NAV_CTA_COMPACT = "text-[15px] leading-5 py-1.5 px-3.5";

/** Same mono / caps / tracking as parent row; subtler white (important beats global `a { color: inherit }` from dialog). */
const MOBILE_DRAWER_SUBMENU_LINK = `${NAV_LABEL_TYPO} block w-full text-left py-2 !text-white/50 hover:!text-white/70 transition-colors`;

const MOBILE_DRAWER_PARENT_LINK =
  `flex min-w-0 flex-1 items-center py-3 pr-2 text-left text-white hover:opacity-95 ${NAV_LABEL_TYPO}`;

const MOBILE_DRAWER_EXPAND_BTN =
  "flex shrink-0 items-center justify-center rounded-lg p-2 text-white -mr-2 hover:bg-white/10";

const MOBILE_MENU_TRANSITION_MS = 320;

function MobileDrawerAccordionGlyph({ expanded }: { expanded: boolean }) {
  const cls = "h-7 w-7 shrink-0 text-white pointer-events-none";
  return expanded ? (
    <MinusIcon className={cls} strokeWidth={1} aria-hidden />
  ) : (
    <PlusIcon className={cls} strokeWidth={1} aria-hidden />
  );
}

/** Smooth height animation for mobile drawer submenus (respects reduced motion). */
function MobileNavSubmenu({
  open,
  children,
}: {
  open: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={`grid transition-[grid-template-rows] duration-[320ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none motion-reduce:duration-0 ${
        open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
      }`}
    >
      <div className="min-h-0 overflow-hidden">
        <div className="flex flex-col gap-0.5 pb-4">{children}</div>
      </div>
    </div>
  );
}

export default function Header() {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<DropdownId>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileMenuMounted, setMobileMenuMounted] = useState(false);
  const [mobileMenuEntered, setMobileMenuEntered] = useState(false);
  const [mobileAccordion, setMobileAccordion] =
    useState<MobileAccordionId>(null);
  const [scrolled, setScrolled] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Default to home style until pathname is known (avoids white bar flash on load)
  const isHome = pathname === "/" || pathname === null;

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

  /** Same-page About + hash: drive AboutTabs via hashchange so tab + scroll run together. */
  const handleAboutMegaLinkClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      if (pathname !== "/about") return;
      e.preventDefault();
      window.history.replaceState(null, "", href);
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    },
    [pathname]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => {
      if (mq.matches) setMobileOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (mobileOpen) {
      setMobileMenuMounted(true);
      if (reducedMotion) {
        setMobileMenuEntered(true);
        return;
      }
      const id = requestAnimationFrame(() => {
        requestAnimationFrame(() => setMobileMenuEntered(true));
      });
      return () => cancelAnimationFrame(id);
    }
    setMobileMenuEntered(false);
    const ms = reducedMotion ? 0 : MOBILE_MENU_TRANSITION_MS;
    const t = window.setTimeout(() => setMobileMenuMounted(false), ms);
    return () => clearTimeout(t);
  }, [mobileOpen]);

  // Sticky nav: seamless background transition on scroll (home only)
  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll(); // set initial
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  const onLightBg = !isHome || (isHome && scrolled);
  /** Mobile sheet open: top bar matches drawer (dark green + white controls). */
  const mobileBarDark = mobileOpen;
  const navClass = mobileBarDark
    ? "text-white"
    : onLightBg
      ? "text-darkgreen"
      : "text-white";
  const desktopNavColor = onLightBg ? "#1F3414" : "#FFFFFF";
  const ctaClass = onLightBg
    ? "cc-btn-primary"
    : "cc-btn-primary-white";

  const desktopNavLinkClass =
    `nav-link-ltr-underline flex items-center px-4 py-2 h-9 ${NAV_LABEL_TYPO} opacity-90 hover:opacity-100 rounded-md outline-none`;

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
          {config.leftLinks.map((link) =>
            id === "about" ? (
              <Link
                key={link.href}
                href={link.href}
                role="menuitem"
                onClick={(e) => handleAboutMegaLinkClick(e, link.href)}
                className="inline-block w-fit font-sans text-sm font-normal leading-normal text-darkgreen border-b border-transparent hover:border-darkgreen/25 transition-colors"
              >
                {link.label}
              </Link>
            ) : (
              <SmoothHashLink
                key={link.href}
                href={link.href}
                samePageScroll="auto"
                role="menuitem"
                onClick={() => setOpenDropdown(null)}
                className="inline-block w-fit font-sans text-sm font-normal leading-normal text-darkgreen border-b border-transparent hover:border-darkgreen/25 transition-colors"
              >
                {link.label}
              </SmoothHashLink>
            )
          )}
        </nav>
      </div>
    );
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 ${
          mobileBarDark
            ? "bg-darkgreen border-b border-white/15"
            : !isHome
              ? "bg-white border-b border-matcha/5"
              : ""
        }`}
        onMouseLeave={handleLeave}
      >
        {/* Main nav bar — on home: transparent until scroll; background layer fades in via opacity */}
        <div className="relative z-20 w-full px-6 md:px-16 py-2">
          {isHome && (
            <div
              className={`absolute inset-0 pointer-events-none nav-scroll-bg backdrop-blur-sm border-b border-matcha/5 transition-opacity duration-[950ms] ease-[cubic-bezier(0.22,0,0.2,1)] ${
                scrolled && !mobileOpen ? "opacity-100" : "opacity-0"
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
                  src={
                    mobileBarDark || (isHome && !onLightBg)
                      ? "/CommonCare_Logo_White.svg"
                      : "/CommonCare_Logo_DarkGreen.svg"
                  }
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
                    onClick={(e) => {
                      if (pathname === "/about") {
                        e.preventDefault();
                        window.history.replaceState(null, "", "/about");
                        window.dispatchEvent(new HashChangeEvent("hashchange"));
                      }
                    }}
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
                <Link href="/book" className={`${ctaClass} ${NAV_CTA_COMPACT}`}>
                  Book an evaluation
                </Link>
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(!mobileOpen)}
                className={`md:hidden p-2 rounded-lg ${navClass} opacity-90 hover:opacity-100`}
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

      {/* Mobile menu: mount for exit animation; panel fades + eases in as one unit */}
      {mobileMenuMounted && (
        <div
          className={`fixed inset-0 z-40 md:hidden flex flex-col bg-darkgreen text-white transition-[opacity,transform] duration-[320ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none motion-reduce:duration-0 ${
            mobileMenuEntered
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-2 pointer-events-none"
          }`}
          role="dialog"
          aria-label="Menu"
          aria-hidden={!mobileMenuEntered}
        >
          <div className="flex-1 min-h-0 overflow-auto pt-24 px-6 pb-[calc(24px+env(safe-area-inset-bottom,0px))]">
          <div className="flex flex-col gap-2">
            {/* Care: parent links to overview; + expands submenu */}
            <div>
              <div className="flex w-full items-center">
                <Link
                  href="/care"
                  className={MOBILE_DRAWER_PARENT_LINK}
                  onClick={() => setMobileOpen(false)}
                >
                  Care
                </Link>
                <button
                  type="button"
                  className={MOBILE_DRAWER_EXPAND_BTN}
                  aria-expanded={mobileAccordion === "care"}
                  aria-label={mobileAccordion === "care" ? "Collapse Care links" : "Expand Care links"}
                  onClick={() =>
                    setMobileAccordion(mobileAccordion === "care" ? null : "care")
                  }
                >
                  <MobileDrawerAccordionGlyph
                    expanded={mobileAccordion === "care"}
                  />
                </button>
              </div>
              <MobileNavSubmenu open={mobileAccordion === "care"}>
                {MEGA_CARE.leftLinks.map((l) => (
                  <SmoothHashLink
                    key={l.href}
                    href={l.href}
                    samePageScroll="auto"
                    className={MOBILE_DRAWER_SUBMENU_LINK}
                    onClick={() => setMobileOpen(false)}
                  >
                    {l.label}
                  </SmoothHashLink>
                ))}
              </MobileNavSubmenu>
            </div>
            {/* First Visit */}
            <div>
              <div className="flex w-full items-center">
                <Link
                  href="/first-visit"
                  className={MOBILE_DRAWER_PARENT_LINK}
                  onClick={() => setMobileOpen(false)}
                >
                  First Visit
                </Link>
                <button
                  type="button"
                  className={MOBILE_DRAWER_EXPAND_BTN}
                  aria-expanded={mobileAccordion === "first-visit"}
                  aria-label={
                    mobileAccordion === "first-visit"
                      ? "Collapse First Visit links"
                      : "Expand First Visit links"
                  }
                  onClick={() =>
                    setMobileAccordion(
                      mobileAccordion === "first-visit" ? null : "first-visit"
                    )
                  }
                >
                  <MobileDrawerAccordionGlyph
                    expanded={mobileAccordion === "first-visit"}
                  />
                </button>
              </div>
              <MobileNavSubmenu open={mobileAccordion === "first-visit"}>
                {MEGA_FIRST_VISIT.leftLinks.map((l) => (
                  <SmoothHashLink
                    key={l.href}
                    href={l.href}
                    samePageScroll="auto"
                    className={MOBILE_DRAWER_SUBMENU_LINK}
                    onClick={() => setMobileOpen(false)}
                  >
                    {l.label}
                  </SmoothHashLink>
                ))}
              </MobileNavSubmenu>
            </div>
            {/* About */}
            <div>
              <div className="flex w-full items-center">
                <Link
                  href="/about"
                  className={MOBILE_DRAWER_PARENT_LINK}
                  onClick={() => setMobileOpen(false)}
                >
                  About
                </Link>
                <button
                  type="button"
                  className={MOBILE_DRAWER_EXPAND_BTN}
                  aria-expanded={mobileAccordion === "about"}
                  aria-label={mobileAccordion === "about" ? "Collapse About links" : "Expand About links"}
                  onClick={() =>
                    setMobileAccordion(mobileAccordion === "about" ? null : "about")
                  }
                >
                  <MobileDrawerAccordionGlyph
                    expanded={mobileAccordion === "about"}
                  />
                </button>
              </div>
              <MobileNavSubmenu open={mobileAccordion === "about"}>
                {MEGA_ABOUT.leftLinks.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={MOBILE_DRAWER_SUBMENU_LINK}
                    onClick={(e) => {
                      handleAboutMegaLinkClick(e, l.href);
                      setMobileOpen(false);
                    }}
                  >
                    {l.label}
                  </Link>
                ))}
              </MobileNavSubmenu>
            </div>
            {/* Insurance */}
            <div>
              <div className="flex w-full items-center">
                <Link
                  href="/insurance"
                  className={MOBILE_DRAWER_PARENT_LINK}
                  onClick={() => setMobileOpen(false)}
                >
                  Insurance
                </Link>
                <button
                  type="button"
                  className={MOBILE_DRAWER_EXPAND_BTN}
                  aria-expanded={mobileAccordion === "insurance"}
                  aria-label={mobileAccordion === "insurance" ? "Collapse Insurance links" : "Expand Insurance links"}
                  onClick={() =>
                    setMobileAccordion(
                      mobileAccordion === "insurance" ? null : "insurance"
                    )
                  }
                >
                  <MobileDrawerAccordionGlyph
                    expanded={mobileAccordion === "insurance"}
                  />
                </button>
              </div>
              <MobileNavSubmenu open={mobileAccordion === "insurance"}>
                {MEGA_INSURANCE.leftLinks.map((l) => (
                  <SmoothHashLink
                    key={l.href}
                    href={l.href}
                    samePageScroll="auto"
                    className={MOBILE_DRAWER_SUBMENU_LINK}
                    onClick={() => setMobileOpen(false)}
                  >
                    {l.label}
                  </SmoothHashLink>
                ))}
              </MobileNavSubmenu>
            </div>
            <div className="pt-4">
              <Link
                href="/book"
                className="cc-btn-primary-white w-full justify-center px-5 py-3 text-[16px] leading-snug"
                onClick={() => setMobileOpen(false)}
              >
                Book an evaluation
              </Link>
            </div>
          </div>
          </div>
        </div>
      )}
    </>
  );
}
