import Link from "next/link";
import ServicesPanels from "./components/ServicesPanels";
import Header from "./components/Header";
import ScrollReveal from "./components/ScrollReveal";
import IsThisForMeSection from "./components/IsThisForMeSection";
import HeroScrollIndicator from "./components/HeroScrollIndicator";
import HeroSubheadRuleLine from "./components/HeroSubheadRuleLine";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen gradient-page">

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

  <div
    className="absolute inset-0 pointer-events-none opacity-[0.35] mix-blend-overlay"
    style={{ filter: "url(#grain)" }}
  />

  <main className="relative z-10 min-h-screen">
      <Header />

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
          <div className="absolute inset-0 z-10 px-6 md:px-16 pointer-events-none">
            <div className="relative mx-auto h-full w-full max-w-[1400px] pointer-events-none">
              <div className="pointer-events-auto absolute top-0 right-0 pt-[224px] md:pt-[256px] max-w-[28rem] lg:max-w-[32rem] text-left">
                <HeroSubheadRuleLine />
                <h5 className="hero-text-float-subhead text-white/80">
                  One-on-one physical therapy and wellness in Los Angeles—built around you with advanced technology, without rush or shortcuts.
                </h5>
              </div>

              <div className="pointer-events-auto absolute bottom-0 left-0 pb-20 md:pb-24 max-w-[min(48rem,100%)] md:max-w-[52rem] lg:max-w-[56rem] hero-text-float-headline">
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
            </div>
          </div>

          <HeroScrollIndicator />
        </div>
      </section>

      {/* Why we exist — editorial */}
      <section
        id="why-we-exist"
        className="py-[80px]"
      >
        <ScrollReveal>
          <div className="w-full px-6 md:px-16">
            <div className="mx-auto w-full max-w-[1400px]">
              <div className="min-w-0 max-w-4xl">
                <p className="cc-eyebrow text-darkgreen mb-4">
                  Why we exist
                </p>
                <h4 className="max-w-4xl">
                  Exceptional care requires time, attention, and a deeper understanding of the individual. Most care models simply aren’t built to provide that.
                </h4>
                <p className="mt-5 max-w-4xl cc-body-18">
                  Most physical therapy is shaped around insurance, not the person.
                  That often means less time and less clarity. Common Care offers something different.
                  Care built around the time and attention it actually takes to help you feel better and stay that way.
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Edge-to-edge clinic photo */}
      <section
        className="relative w-screen max-w-[100vw] ml-[calc(50%-50vw)] min-w-0"
        aria-hidden
      >
        <img
          src="/images/clinic-space.png"
          alt=""
          className="w-full h-[420px] md:h-[580px] object-cover"
        />
      </section>

      {/* What makes us different */}
      <section
        id="what-makes-us-different"
        className="relative overflow-hidden border-b border-white/10 py-[120px]"
      >
        <div
          aria-hidden
          className="absolute inset-0 bg-[url('/Brown.png')] bg-cover bg-center"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-black/10"
        />
        <ScrollReveal>
        <div className="relative z-10 w-full px-6 md:px-16">
          <div className="mx-auto w-full max-w-[1400px]">
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_520px] lg:gap-x-14 lg:items-start">
              <h4 className="max-w-4xl text-balance text-white">
                A different standard of care.
              </h4>

              {/* Desktop button aligned to the heading row (same x as the image column). */}
              <div className="hidden lg:flex justify-end">
                <Link href="/care" className="cc-btn-inverse px-6 py-3 text-[17px]">
                  Care overview
                </Link>
              </div>
            </div>

            <div className="mt-24 md:mt-32 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_520px] lg:gap-x-14 lg:items-end">
              <div className="flex flex-col min-w-0">
                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-12 md:gap-x-12 md:gap-y-14">
                  {[
                    {
                      title: "Unhurried, focused sessions",
                      body: "Sessions range from 1–2 hours of one-on-one time so we can actually listen, assess, and care for you fully.",
                    },
                    {
                      title: "The full picture, not just the pain.",
                      body: "We look beyond symptoms to how you move, sleep, and manage stress. That’s where real change begins.",
                    },
                    {
                      title: "Continuous care with one therapist.",
                      body: "You work with the same PT each session, so your progress builds instead of starting over.",
                    },
                    {
                      title: "Built for sustainability.",
                      body: "The goal isn’t to keep you coming in. It’s to help you understand your body and maintain your health on your own.",
                    },
                  ].map((item) => (
                    <div key={item.title} className="min-w-0">
                      <h5 className="max-w-xl text-white">
                        {item.title}
                      </h5>
                      <div className="text-group pt-3">
                        <p className="mt-3 max-w-md text-white/60">{item.body}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-12 md:mt-14 lg:hidden">
                  <Link href="/care" className="cc-btn-inverse px-6 py-3 text-[17px]">
                    Care overview
                  </Link>
                </div>
              </div>

              <div className="hidden lg:flex w-full max-w-[520px] shrink-0 self-end">
                <div className="w-full h-[368px] overflow-hidden rounded-sm bg-white/5">
                  <img
                    src="/images/Treatment-hands.JPG"
                    alt=""
                    className="w-full h-full object-cover"
                    aria-hidden
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        </ScrollReveal>
      </section>

      <ServicesPanels />

      <IsThisForMeSection />

      {/* Patient quote — editorial */}
      <section
        id="patient-quote"
        className="border-t border-darkgreen/10 py-[80px]"
      >
        <ScrollReveal>
          <div className="w-full px-6 md:px-16">
            <div className="mx-auto w-full max-w-[1400px]">
            <figure className="mx-auto max-w-3xl">
              <blockquote className="m-0 border-0 p-0">
                <p className="m-0 text-[1.125rem] md:text-[1.3125rem] leading-[1.5] text-darkgreen font-normal tracking-tight">
                  &ldquo;I&apos;ve struggled to find practitioners who genuinely listen
                  and take all of life&apos;s circumstances into account. Even if you
                  don&apos;t have anything specific that feels &apos;off,&apos;
                  it&apos;s an opportunity to take inventory of your health.&rdquo;
                </p>
              </blockquote>
              <figcaption className="mt-8 text-[15px] text-forest/65 not-italic">
                — Patient, Common Care
              </figcaption>
            </figure>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <section id="insurance" className="mt-0">
        <div className="w-full border-y border-darkgreen/10 py-[80px]">
          <ScrollReveal>
            <div className="w-full px-6 md:px-16">
              <div className="mx-auto w-full max-w-[1400px]">
              <div className="mx-auto w-full max-w-3xl text-center flex flex-col items-center gap-6">
                <h4>
                  Out-of-network, with support.
                </h4>
                <p className="max-w-2xl">
                  We&apos;re an out-of-network provider. Many of our patients receive
                  partial reimbursement through their insurance plan. Submit your
                  information and we&apos;ll verify your benefits and expected cost
                  before your first visit. From there, our team handles the
                  reimbursement submission for you.
                </p>
                <Link
                  href="/insurance"
                  className="cc-btn-primary px-5 py-3"
                >
                  Check insurance
                </Link>
              </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

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
          <div className="relative z-10 w-full px-6 md:px-16">
            <div className="mx-auto w-full max-w-[1400px] text-center text-white">
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
          </div>
        </ScrollReveal>
      </section>

      <Footer />
      </main>
    </div>
  );
}
