import Image from "next/image";
import ServicesPanels from "./components/ServicesPanels";
import Header from "./components/Header";
import ScrollReveal from "./components/ScrollReveal";
import IsThisForMeSection from "./components/IsThisForMeSection";
import HeroScrollIndicator from "./components/HeroScrollIndicator";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen gradient-page">
  
  {/* SVG filter definition */}
  <svg className="absolute w-0 h-0" aria-hidden="true">
    <filter id="grain">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.8"
        numOctaves="3"
        stitchTiles="stitch"
      />
      <feColorMatrix type="saturate" values="0" />
    </filter>
  </svg>

  <div className="bg-motion-overlay" aria-hidden />
  
  {/* Replace your existing grain-overlay with this */}
  <div
    className="absolute inset-0 pointer-events-none opacity-[0.35] mix-blend-overlay"
    style={{ filter: "url(#grain)" }}
  />

  <main className="relative z-10 min-h-screen">
      <Header />

      {/* Hero — full viewport height; extra height compensates for -mt so bottom fills viewport and no peek */}
      <section className="hero-full-viewport relative flex flex-col overflow-hidden -mt-28 md:-mt-[7.5rem]">
        <div className="absolute inset-0 hero-radials-drift" />
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.08] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
          }}
        />

        <div className="relative z-10 w-full h-full min-h-full">
          <div className="absolute top-0 right-0 pt-[224px] md:pt-[256px] px-6 md:px-16 md:pr-16 md:pl-0 md:max-w-[28rem] lg:max-w-[32rem] text-left">
            <div className="w-full md:w-[calc(100%+4rem)] mb-6 overflow-hidden">
              <div className="hero-subhead-line h-px bg-white/40 origin-left" aria-hidden />
            </div>
            <h5
              className="hero-text-float-subhead text-white/80"
              style={{ fontWeight: 500 }}
            >
              Comprehensive one-on-one physical therapy and wellness care in Los Angeles — without the rush or the shortcuts.
            </h5>
          </div>

          <div className="absolute bottom-0 left-0 px-6 md:px-16 pb-20 md:pb-24 max-w-[min(48rem,92vw)] md:max-w-[52rem] lg:max-w-[56rem] hero-text-float-headline">
            <h1 className="text-white">
              Exceptional care
              <br />
              made common
            </h1>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="/book"
                className="cc-btn-inverse px-5 py-3"
              >
                Book an evaluation
              </a>
              <a
                href="#insurance"
                className="cc-btn-inverse px-5 py-3"
              >
                Check insurance
              </a>
            </div>
          </div>

          <HeroScrollIndicator />
        </div>
      </section>

      {/* Services — scroll-pinned parallax (no ScrollReveal: transform breaks sticky) */}
      <ServicesPanels />

      {/* Value Props — understated editorial panel */}
      <section id="approach" className="py-[120px]">
        <ScrollReveal>
        <div className="w-full px-6 md:px-16">
          <div
            className="mx-auto max-w-[1400px] rounded-2xl border border-forest/[0.08] bg-bone/55 px-8 py-14 shadow-[0_1px_0_rgba(31,52,20,0.04),0_24px_48px_-32px_rgba(31,52,20,0.08)] md:px-14 md:py-16"
          >
            <p className="cc-eyebrow text-darkgreen mb-5 md:mb-6">
              Approach
            </p>
            <h4 className="max-w-3xl text-balance">
              The way we practice care
            </h4>
            <div className="mt-10 md:mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-12 md:gap-x-12 md:gap-y-14">
              {[
                { title: "Unhurried sessions", body: "60–90 minutes of focused, one-on-one attention every visit." },
                { title: "Whole-picture view", body: "Posture, movement, stress, lifestyle — not just the site of pain." },
                { title: "Practical guidance", body: "Clear steps that fit into real life, not overwhelming protocols." },
                { title: "Built to last", body: "Steady progress you can sustain — not quick fixes that fade." },
              ].map((item) => (
                <div key={item.title} className="min-w-0">
                  <h5 className="m-0 text-[1.125rem] leading-snug font-medium tracking-tight text-darkgreen md:text-[1.1875rem]">
                    {item.title}
                  </h5>
                  <p className="m-0 mt-2 text-[15px] leading-relaxed text-forest/72">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        </ScrollReveal>
      </section>

      <IsThisForMeSection />

      {/* Your first visit — image left, text right */}
      <section id="first-visit" className="py-[120px]">
        <ScrollReveal>
        <div className="w-full px-6 md:px-16">
          <div className="md:grid md:grid-cols-12 md:gap-3 md:items-center">
            <div className="pt-12 md:pt-0 md:col-span-7 order-2 md:order-1 md:pr-4">
              <div className="rounded-xl overflow-hidden h-[313px] w-full max-w-[88%] bg-matcha/10">
                <img
                  src="/images/clinic-space.png"
                  alt="Common Care clinic space"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="md:col-span-5 md:col-start-8 order-1 md:order-2 flex flex-col gap-6">
              <h4 className="max-w-xl">
                Your first visit
              </h4>
              <p>
                Your first visit is comprehensive and unhurried. We evaluate movement, posture, and lifestyle to understand the full picture.
              </p>
              <a
                href="/first-visit"
                className="cc-btn-primary w-fit self-start px-6 py-3"
              >
                What to expect
              </a>
            </div>
          </div>
        </div>
        </ScrollReveal>
      </section>

      {/* Insurance utility section — vertical padding inside the divider lines */}
      <section id="insurance" className="mt-0">
        <div className="w-full border-y border-darkgreen/10 py-[80px]">
          <ScrollReveal>
            <div className="w-full px-6 md:px-16">
              <div className="mx-auto w-full max-w-3xl text-center flex flex-col items-center gap-6">
                <h4>
                  Understand your coverage before you book.
                </h4>
                <p>
                  Our team verifies your benefits and explains your expected cost within 24 hours.
                  <br />
                  No surprises.
                </p>
                <a
                  href="#insurance"
                  className="cc-btn-primary px-5 py-3"
                >
                  Check insurance
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Final CTA — full-bleed gradient */}
      <section className="relative min-h-[50vh] md:min-h-[55vh] flex flex-col items-center justify-center overflow-hidden py-[120px]">
        <div className="absolute inset-0">
          <img
            src="/images/gradient-1.png"
            alt=""
            className="w-full h-full object-cover"
            aria-hidden
          />
        </div>
        <ScrollReveal>
          <div className="relative z-10 w-full px-16 text-center text-white">
            <h4 className="text-white">
              Precision care, built around you.
            </h4>
            <a
              href="/book"
              className="mt-10 cc-btn-inverse px-6 py-3.5"
            >
              Book an Evaluation
            </a>
          </div>
        </ScrollReveal>
      </section>

      <Footer />
      </main>
    </div>
  );
}
