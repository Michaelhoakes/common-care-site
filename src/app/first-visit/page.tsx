import FirstVisitClient from "./components/FirstVisitClient";
import Footer from "../components/Footer";

export const metadata = {
  title: "First Visit — Common Care",
  description:
    "What to expect, how to prepare, and everything you need to know before your first visit.",
};

export default function FirstVisitPage() {
  return (
    <div className="min-h-screen gradient-page relative">
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <filter id="grain-first-visit">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </svg>
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.15] mix-blend-overlay"
        style={{ filter: "url(#grain-first-visit)" }}
        aria-hidden
      />

      <main className="relative z-10">
        <header className="w-full px-16 pt-14 md:pt-16 pb-10 md:pb-12 min-h-[35vh] max-h-[45vh] flex flex-col justify-center">
          <div className="w-full max-w-[1400px]">
            <h1 className="font-hero-display text-4xl sm:text-5xl md:text-5xl text-darkgreen font-normal tracking-normal max-w-3xl">
              Your first visit
            </h1>
            <p className="mt-5 md:mt-6 text-lg md:text-xl text-forest/90 leading-relaxed max-w-2xl">
              What to expect, how to prepare, and everything you need to know before you arrive.
            </p>
          </div>
        </header>

        <FirstVisitClient />
        <Footer />
      </main>
    </div>
  );
}
