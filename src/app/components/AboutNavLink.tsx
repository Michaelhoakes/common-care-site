"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps, ReactNode } from "react";

/**
 * About routes: same-page clicks update the URL + dispatch `hashchange` so AboutTabs
 * can sync tabs and scroll to top (no fragment scroll-into-view).
 */
export default function AboutNavLink({
  href,
  className,
  children,
  onClick,
  ...rest
}: Omit<ComponentProps<typeof Link>, "href" | "children"> & {
  href: "/about" | `/about#${string}`;
  children: ReactNode;
}) {
  const pathname = usePathname();

  return (
    <Link
      {...rest}
      href={href}
      className={className}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        if (pathname !== "/about") return;
        e.preventDefault();
        window.history.replaceState(null, "", href);
        window.dispatchEvent(new HashChangeEvent("hashchange"));
      }}
    >
      {children}
    </Link>
  );
}
