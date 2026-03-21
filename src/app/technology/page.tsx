import TechnologyClient from "./components/TechnologyClient";
import Footer from "../components/Footer";

export const metadata = {
  title: "Technology — Common Care",
  description:
    "The tools we use to understand how you move — motion capture, force plates, surface EMG, and posture assessment.",
};

export default function TechnologyPage() {
  return (
    <div className="min-h-screen gradient-page relative">
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <filter id="grain-technology">
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
        style={{ filter: "url(#grain-technology)" }}
        aria-hidden
      />

      <main className="relative z-10">
        <header className="w-full px-16 pt-16 md:pt-20 pb-12 md:pb-16">
          <div className="w-full max-w-[1400px]">
            <h1 className="font-hero-display text-4xl sm:text-5xl md:text-6xl text-darkgreen font-normal tracking-normal max-w-3xl">
              Technology
            </h1>
            <p className="mt-6 md:mt-8 text-lg md:text-xl text-forest/90 leading-relaxed max-w-2xl">
              We use a small set of tools to see how you move and load your body — so we can tailor care to what’s actually going on, not guesswork.
            </p>
          </div>
        </header>

        <section className="w-full px-16 pb-24 md:pb-32">
          <div className="w-full max-w-[1400px]">
            <TechnologyClient />
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}
