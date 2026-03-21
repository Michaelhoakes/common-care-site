"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";

export default function LayoutWithHeader({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHome = pathname === "/" || pathname === null;

  return (
    <>
      {!isHome && <Header />}
      {children}
    </>
  );
}
