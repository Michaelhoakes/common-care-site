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

        <div
          className="relative z-10 w-full h-full min-h-full"
          style={{ fontFamily: '"neue-haas-grotesk-display", var(--font-inter), system-ui, sans-serif' }}
        >
          <div className="absolute top-0 right-0 pt-[224px] md:pt-[256px] px-6 md:px-16 md:pr-16 md:pl-0 md:max-w-[28rem] lg:max-w-[32rem] text-left">
            <div className="w-full md:w-[calc(100%+4rem)] mb-6 overflow-hidden">
              <div className="hero-subhead-line h-px bg-white/40 origin-left" aria-hidden />
            </div>
            <p className="hero-text-float-subhead text-[24px] text-white/80 leading-relaxed font-medium">
              Comprehensive one-on-one physical therapy and wellness care in Los Angeles — without the rush or the shortcuts.
            </p>
          </div>

          <div className="absolute bottom-0 left-0 px-6 md:px-16 pb-20 md:pb-24 max-w-[min(48rem,92vw)] md:max-w-[52rem] lg:max-w-[56rem] hero-text-float-headline">
            <h1 className="text-[48px] sm:text-[56px] md:text-[72px] lg:text-[90px] leading-[1.05] text-white font-normal">
              Exceptional care
              <br />
              made common
            </h1>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="/book"
                className="rounded-full bg-white/15 backdrop-blur-sm border border-white/20 px-5 py-3 text-base font-medium text-white hover:bg-white/25"
                style={{ fontFamily: '"neue-haas-grotesk-text", var(--font-inter), system-ui, sans-serif', fontSize: '16px', fontWeight: 500 }}
              >
                Book an evaluation
              </a>
              <a
                href="#insurance"
                className="rounded-full border border-white/20 px-5 py-3 text-base font-medium text-white hover:bg-white/10"
                style={{ fontFamily: '"neue-haas-grotesk-text", var(--font-inter), system-ui, sans-serif', fontSize: '16px', fontWeight: 500 }}
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

      {/* Value Props — right column aligned with "Your first visit" */}
      <section id="approach" className="pt-6 md:pt-8 pb-24 md:pb-32">
        <ScrollReveal>
        <div className="w-full px-6 md:px-16">
          <div className="flex flex-col md:grid md:grid-cols-12 md:gap-3 md:items-start">
            <h4 className="font-hero-display tracking-normal text-2xl md:text-[40px] text-darkgreen max-w-md shrink-0 md:col-span-7">
              The way we practice care
            </h4>
            <div className="mt-6 md:mt-0 flex flex-col md:col-span-5 md:col-start-8">
              {[
                { title: "Unhurried sessions", body: "60–90 minutes of focused, one-on-one attention every visit." },
                { title: "Whole-picture view", body: "Posture, movement, stress, lifestyle — not just the site of pain." },
                { title: "Practical guidance", body: "Clear steps that fit into real life, not overwhelming protocols." },
                { title: "Built to last", body: "Steady progress you can sustain — not quick fixes that fade." },
              ].map((item, i, arr) => (
                <div key={item.title} className={i < arr.length - 1 ? "mb-6 md:mb-5" : ""}>
                  <h3 className="font-hero-display text-[24px] font-medium text-darkgreen">{item.title}</h3>
                  <p className="mt-1 text-[16px] opacity-70 leading-relaxed">{item.body}</p>
                  {i < arr.length - 1 && (
                    <div
                      className="mt-6 md:mt-5 h-px bg-darkgreen/20 -mr-6 md:-mr-16 w-[calc(100%+1.5rem)] md:w-[calc(100%+4rem)]"
                      aria-hidden
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        </ScrollReveal>
      </section>

      <IsThisForMeSection />

      {/* Your first visit — image left, text right */}
      <section id="first-visit" className="py-32 md:py-40">
        <ScrollReveal>
        <div className="w-full px-6 md:px-16">
          <div className="md:grid md:grid-cols-12 md:gap-3 md:items-center">
            <div className="mt-12 md:mt-0 md:col-span-7 order-2 md:order-1 md:pr-4">
              <div className="rounded-xl overflow-hidden h-[313px] w-full max-w-[88%] bg-matcha/10">
                <img
                  src="/images/clinic-space.png"
                  alt="Common Care clinic space"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="md:col-span-5 md:col-start-8 order-1 md:order-2">
              <h2 className="font-hero-display tracking-normal font-normal text-4xl md:text-5xl text-darkgreen max-w-xl">
                Your first visit
              </h2>
              <p className="mt-6 text-base opacity-90 leading-relaxed">
                Your first visit is comprehensive and unhurried. We evaluate movement, posture, and lifestyle to understand the full picture.
              </p>
              <a
                href="/first-visit"
                className="mt-8 inline-flex items-center justify-center rounded-full border border-darkgreen/20 bg-darkgreen text-light-green px-6 py-3 text-base font-medium hover:bg-darkgreen/90 hover:border-darkgreen/30 transition-colors"
              >
                What to expect
              </a>
            </div>
          </div>
        </div>
        </ScrollReveal>
      </section>

      {/* Insurance CTA */}
      <section id="insurance" className="py-0">
        <div className="mx-6 md:mx-16 relative overflow-hidden rounded-2xl py-16 flex flex-col items-center justify-center text-center">
          {/* Subtle gradient overlay — soft variation so it isn’t flat */}
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse 70% 60% at 20% 40%, rgba(91, 121, 68, 0.35) 0%, transparent 55%),
                radial-gradient(ellipse 60% 70% at 80% 60%, rgba(45, 74, 46, 0.5) 0%, transparent 50%),
                linear-gradient(165deg, #2D4A2E 0%, #1F3414 50%, #2D4A2E 100%)
              `,
            }}
          />
          {/* Grain texture — same as hero for consistency */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.08] mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              backgroundRepeat: "repeat",
            }}
          />
        <ScrollReveal>
        <div className="relative z-10 w-full px-6 md:px-16 flex flex-col items-center">
          <h2 className="font-hero-display tracking-normal font-normal text-4xl md:text-5xl max-w-xl text-white">
            Insurance, simplified.
          </h2>
          <p className="mt-6 max-w-xl text-lg opacity-90 leading-relaxed text-white/90">
            We verify eligibility and help you understand your coverage within 24 hours.
          </p>
          <a
            href="#insurance"
            className="mt-10 inline-flex rounded-full border border-white/20 px-5 py-3 text-base font-medium text-white hover:bg-white/10"
            style={{ fontFamily: '"neue-haas-grotesk-text", var(--font-inter), system-ui, sans-serif', fontSize: '16px', fontWeight: 500 }}
          >
            Check insurance
          </a>
        </div>
        </ScrollReveal>
        </div>
      </section>

      {/* Final CTA — full-bleed clinic image */}
      <section className="relative min-h-[50vh] md:min-h-[55vh] flex flex-col items-center justify-center overflow-hidden mt-20 md:mt-28">
        <div className="absolute inset-0">
          <img
            src="/images/clinic-space.png"
            alt=""
            className="w-full h-full object-cover"
            aria-hidden
          />
          <div className="absolute inset-0 bg-black/35" aria-hidden />
        </div>
        <ScrollReveal>
          <div className="relative z-10 w-full px-16 text-center">
            <h2 className="font-hero-display tracking-normal text-4xl md:text-6xl text-white">
              Care, practiced.
            </h2>
            <p className="mt-6 text-xl text-white/90">
              Begin with a 360 Evaluation.
            </p>
            <a
              href="/book"
              className="mt-10 inline-flex rounded-full bg-white/20 backdrop-blur-sm border border-white/30 px-6 py-3.5 text-base font-medium text-white hover:bg-white/30"
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
