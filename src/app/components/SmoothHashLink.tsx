"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";

import { usePrefersReducedMotion } from "../care/hooks/useCareSidebarProgress";

type SmoothHashLinkProps = Omit<
  ComponentProps<typeof Link>,
  "href" | "onClick"
> & {
  href: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
  /**
   * Same-route fragment navigation only. `"smooth"` (default) for in-page CTAs;
   * `"auto"` for header/footer section jumps (instant, `block: "start"`).
   */
  samePageScroll?: "smooth" | "auto";
};

function pathMatches(a: string, b: string) {
  return a.replace(/\/$/, "") === b.replace(/\/$/, "");
}

/**
 * Same-page hash navigation with smooth scroll. Next.js `Link` often jumps
 * instantly to fragments; this intercepts when the target is the current route.
 */
export default function SmoothHashLink({
  href,
  className,
  children,
  onClick,
  samePageScroll = "smooth",
  ...rest
}: SmoothHashLinkProps) {
  const reduceMotion = usePrefersReducedMotion();

  return (
    <Link
      {...rest}
      href={href}
      className={className}
      onClick={(e) => {
        const invokeUser = () => onClick?.(e);

        let pathname: string;
        let hash: string;
        try {
          const u = new URL(href, window.location.href);
          pathname = u.pathname;
          hash = u.hash;
        } catch {
          invokeUser();
          return;
        }
        if (!hash || hash === "#") {
          invokeUser();
          return;
        }
        if (!pathMatches(pathname, window.location.pathname)) {
          invokeUser();
          return;
        }

        const id = decodeURIComponent(hash.slice(1));
        const el = document.getElementById(id);
        if (!el) {
          invokeUser();
          return;
        }

        const instant =
          samePageScroll === "auto" || reduceMotion;
        e.preventDefault();
        el.scrollIntoView({
          behavior: instant ? "auto" : "smooth",
          block: "start",
        });
        window.history.pushState(
          null,
          "",
          `${window.location.pathname}${window.location.search}${hash}`
        );
        invokeUser();
      }}
    >
      {children}
    </Link>
  );
}
