import CarePageClient from "./components/CarePageClient";
import Footer from "../components/Footer";

export const metadata = {
  title: "Care — Common Care",
  description:
    "How care unfolds here: comprehensive evaluation, one-on-one sessions, and everyday wellness support — designed for long-term health.",
};

export default function CarePage() {
  return (
    <div className="min-h-screen gradient-page relative">
      {/* Grain overlay — consistent with rest of site */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <filter id="grain-care">
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
        className="absolute inset-0 pointer-events-none opacity-[0.2] mix-blend-overlay"
        style={{ filter: "url(#grain-care)" }}
        aria-hidden
      />

      <main className="relative z-10">
        {/* Short hero: 55–70vh, headline + subline */}
        <header className="px-16 pt-16 md:pt-20 pb-14 md:pb-16 min-h-[55vh] max-h-[70vh] flex flex-col justify-center">
          <div className="w-full max-w-[1400px]">
            <h1 className="font-hero-display text-4xl sm:text-5xl md:text-6xl text-darkgreen font-normal tracking-normal max-w-3xl">
              How care unfolds here.
            </h1>
            <p className="mt-6 md:mt-8 text-lg md:text-xl text-forest/90 leading-relaxed max-w-2xl">
              Comprehensive evaluation, one-on-one sessions, and everyday wellness support — designed for long-term health, without the rush or shortcuts.
            </p>
          </div>
        </header>

        <CarePageClient />
        <Footer />
      </main>
    </div>
  );
}
