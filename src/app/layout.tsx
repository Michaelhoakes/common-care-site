import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import LayoutWithHeader from "./components/LayoutWithHeader";
import TypekitFonts from "./components/TypekitFonts";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Common Care — Physical Therapy & Wellness",
  description: "Thoughtful, one-on-one care designed for steady, sustainable health.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://use.typekit.net" crossOrigin="anonymous" />
      </head>
      <body
        className={`${inter.variable} ${geistMono.variable} antialiased`}
      >
        <TypekitFonts />
        <LayoutWithHeader>{children}</LayoutWithHeader>
      </body>
    </html>
  );
}
