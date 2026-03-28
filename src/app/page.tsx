import Link from "next/link";
import ServicesPanels from "./components/ServicesPanels";
import Header from "./components/Header";
import ScrollReveal from "./components/ScrollReveal";
import IsThisForMeSection from "./components/IsThisForMeSection";
import HeroSubheadRuleLine from "./components/HeroSubheadRuleLine";
import Footer from "./components/Footer";
import HomeHeroParallaxBackground from "./components/HomeHeroParallaxBackground";
import HomeParallaxBleedImage from "./components/HomeParallaxBleedImage";
import HomeBrownParallaxPicture from "./components/HomeBrownParallaxPicture";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
  <main className="relative z-10 min-h-screen bg-background">
      <Header />

      <section className="hero-full-viewport relative z-0 flex flex-col overflow-hidden -mt-28 md:-mt-[7.5rem]">
        <HomeHeroParallaxBackground />

        <div className="relative z-10 w-full h-full min-h-full">
          {/* Mobile: flex-based vertical distribution for consistent spacing across devices */}
          <div className="md:hidden z-10 h-full min-h-full px-6 pointer-events-none">
            <div
              className="mx-auto flex h-full min-h-full w-full max-w-[1400px] flex-col pt-40 pointer-events-none"
              style={{
                paddingBottom:
                  "max(8rem, calc(env(safe-area-inset-bottom, 0px) + 2.5rem))",
              }}
            >
              <div className="flex flex-col gap-12">
                <div className="pointer-events-auto ml-auto max-w-[22rem] text-left">
                  <HeroSubheadRuleLine />
                  <h5 className="hero-text-float-subhead text-white/80 m-0">
                    One-on-one physical therapy and wellness in Los Angeles—built around you.
                  </h5>
                </div>
                <div className="pointer-events-auto max-w-[min(48rem,100%)] hero-text-float-headline">
                <h1 className="cc-heading-xl text-white m-0">
                    Exceptional care
                    <br />
                    made common
                  </h1>
                </div>
              </div>
              <div className="pointer-events-auto mt-10 hero-text-float-cta">
                <div className="flex flex-wrap gap-2 md:gap-3">
                  <a
                    href="/book"
                    className="cc-hero-btn cc-hero-btn-primary"
                  >
                    Book an evaluation
                  </a>
                  <a
                    href="#insurance"
                    className="cc-hero-btn cc-hero-btn-inverse"
                  >
                    Check insurance
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop/tablet: preserve existing composition */}
          <div className="hidden md:block absolute inset-0 z-10 px-6 md:px-16 pointer-events-none">
            <div className="relative mx-auto h-full w-full max-w-[1400px] pointer-events-none">
              <div className="pointer-events-auto absolute top-0 right-0 pt-[260px] md:pt-[292px] max-w-[26rem] lg:max-w-[30rem] text-left">
                <HeroSubheadRuleLine />
                <h5 className="hero-text-float-subhead text-white/80">
                  One-on-one physical therapy and wellness in Los Angeles—built around you.
                </h5>
              </div>

              <div className="pointer-events-auto absolute bottom-0 left-0 pb-40 md:pb-44 max-w-[min(48rem,100%)] md:max-w-[52rem] lg:max-w-[56rem] hero-text-float-headline">
                <h1 className="cc-heading-xl text-white">
                  Exceptional care
                  <br />
                  made common
                </h1>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href="/book"
                    className="cc-hero-btn cc-hero-btn-primary"
                  >
                    Book an evaluation
                  </a>
                  <a
                    href="#insurance"
                    className="cc-hero-btn cc-hero-btn-inverse"
                  >
                    Check insurance
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why we exist — editorial */}
      <section
        id="why-we-exist"
        className="home-editorial-stack-layer relative z-[1] bg-background pt-10 md:pt-14 lg:pt-20 pb-0"
      >
        <ScrollReveal>
          <div className="w-full px-6 md:px-16 pb-10 md:pb-14 lg:pb-20">
            <div className="mx-auto w-full max-w-[1400px]">
              <div className="min-w-0 max-w-3xl">
                <p className="cc-eyebrow text-darkgreen mt-0 mb-4">
                  Why we exist
                </p>
              <h2 className="cc-heading-sm max-w-4xl">
                  Exceptional care requires time, attention, and a deeper understanding of you.
                </h2>
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
        className="home-editorial-stack-layer relative z-[2] w-screen max-w-[100vw] ml-[calc(50%-50vw)] min-w-0 mt-0 overflow-hidden"
        aria-hidden
      >
        <HomeParallaxBleedImage
          src="/images/Clinic-front.jpeg"
          alt=""
          wrapperClassName="relative w-full h-[120px] md:h-[500px]"
          imgClassName="h-full w-full object-cover object-[right_70%]"
          motionInsetClassName="-inset-[7%]"
          options={{
            parallaxFactor: 0.048,
            maxOffsetPx: 40,
            lerp: 0.11,
            scale: 0.93,
          }}
        />
      </section>

      {/* What makes us different */}
      <section
        id="what-makes-us-different"
        className="home-editorial-stack-layer relative z-[3] pt-10 md:pt-14 lg:pt-20 pb-0"
      >
        <HomeBrownParallaxPicture />
        <ScrollReveal>
        <div className="relative z-10 w-full px-6 md:px-16 pb-10 md:pb-14 lg:pb-20">
          <div className="mx-auto w-full max-w-[1400px]">
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_520px] lg:gap-x-14 lg:items-start">
              <h2 className="cc-heading-sm max-w-4xl text-balance text-white">
                A different standard of care.
              </h2>

              {/* Desktop button aligned to the heading row (same x as the image column). */}
              <div className="hidden lg:flex justify-end">
                <Link href="/care" className="cc-btn-secondary-white px-6 py-3 text-[17px]">
                  Care overview
                </Link>
              </div>
            </div>

            <div className="mt-8 py-6 md:py-0 lg:hidden">
              <div className="w-full overflow-hidden rounded-sm bg-white/5">
                <img
                  src="/images/Treatment-hands.JPG"
                  alt=""
                  className="w-full h-[220px] sm:h-[260px] md:h-[300px] object-cover"
                  aria-hidden
                />
              </div>
            </div>

            <div className="mt-6 lg:mt-24 xl:mt-32 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_520px] lg:gap-x-14 lg:items-end">
              <div className="flex flex-col min-w-0">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-6 lg:gap-x-10 lg:gap-y-12 xl:gap-x-12 xl:gap-y-14">
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
                      <h3 className="cc-heading-xs max-w-xl text-white">
                        {item.title}
                      </h3>
                      <div className="text-group pt-3">
                        <p className="mt-3 max-w-md text-white/60">{item.body}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-12 md:mt-14 lg:hidden">
                  <Link href="/care" className="cc-btn-secondary-white px-6 py-3 text-[17px]">
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

      <ServicesPanels sectionClassName="home-editorial-stack-layer relative z-[4] bg-background" />

      <IsThisForMeSection sectionClassName="home-editorial-stack-layer relative z-[5]" />

      {/* Patient quote — editorial */}
      <section
        id="patient-quote"
        className="home-editorial-stack-layer relative z-[6] bg-background pt-10 md:pt-14 lg:pt-20 pb-0"
      >
        <ScrollReveal>
          <div className="w-full px-6 md:px-16">
            <div className="mx-auto w-full max-w-[1400px]">
              <div className="pb-8 md:pb-10">
                <p className="cc-eyebrow text-darkgreen m-0">
                  From our clients
                </p>
              </div>
              <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-14 lg:items-stretch">
                <figure className="m-0 flex min-h-0 min-w-0 flex-col self-stretch lg:h-full">
                  <div className="flex h-full min-h-0 w-full flex-col rounded-lg border border-forest/25 p-4 md:p-8">
                    <blockquote className="m-0 shrink-0 border-0 p-0 not-italic">
                      <p className="m-0 !mt-0 cc-heading-xs text-darkgreen">
                        &ldquo;This is a place where you&apos;re truly heard and cared for in
                        the midst of everything else. Mike doesn&apos;t just treat symptoms; he
                        helps you understand your body and how stress and daily life shape how
                        you feel. Even if you don&apos;t have anything specific that feels
                        &ldquo;off,&rdquo;{" "}
                        <span className="font-semibold">
                          it&apos;s an opportunity to take inventory of your health.
                        </span>
                        &rdquo;
                      </p>
                    </blockquote>
                    <div className="min-h-0 flex-1" aria-hidden />
                    <figcaption className="m-0 shrink-0 pt-3 cc-subtext leading-snug text-forest/65 not-italic opacity-100">
                      &ndash;Natasha B.
                    </figcaption>
                  </div>
                </figure>
                <figure className="m-0 flex min-h-0 min-w-0 flex-col self-stretch lg:h-full">
                  <div className="flex h-full min-h-0 w-full flex-col rounded-lg border border-forest/25 p-4 md:p-8">
                    <blockquote className="m-0 shrink-0 border-0 p-0 not-italic">
                      <p className="m-0 !mt-0 cc-heading-xs text-darkgreen">
                        &ldquo;I came in with severe hip pain, unsure if I&apos;d even make it
                        to race day&mdash;but after working with Mike, everything changed.
                        His ability to identify the root cause, combined with a deeply
                        personalized approach, got me back to running stronger than ever in
                        just weeks.{" "}
                        <span className="font-semibold">
                          This isn&apos;t just physical therapy&mdash;it&apos;s the highest
                          level of care, delivered with expertise, intention, and genuine care.
                        </span>
                        &rdquo;
                      </p>
                    </blockquote>
                    <div className="min-h-0 flex-1" aria-hidden />
                    <figcaption className="m-0 shrink-0 pt-3 cc-subtext leading-snug text-forest/65 not-italic opacity-100">
                      &ndash; Daniel M.
                    </figcaption>
                  </div>
                </figure>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <section
        id="insurance"
        className="home-editorial-stack-layer relative z-[7] mt-0 bg-background"
      >
        <div className="w-full pt-12 md:pt-14 lg:pt-[80px]" aria-hidden>
          <div className="w-full border-t border-darkgreen/12" />
        </div>
        <div className="w-full pt-10 pb-0 md:pt-14 lg:pt-20">
          <ScrollReveal>
            <div className="w-full px-6 md:px-16">
              <div className="mx-auto w-full max-w-[1400px]">
              <div className="mx-auto w-full max-w-3xl text-center flex flex-col items-center gap-6">
                <h2 className="cc-heading-sm">
                  Check your insurance coverage
                </h2>
                <p className="max-w-2xl" style={{ margin: 0 }}>
                  We&apos;re out-of-network. We verify your benefits and expected
                  cost before your first visit, then handle reimbursement for you.
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

      <section className="home-editorial-stack-layer home-editorial-stack-layer--no-trailer relative z-[8] flex min-h-[66vh] md:min-h-[58vh] flex-col items-center justify-end pb-[4.5rem] md:pb-[5.5rem] lg:pb-[7rem]">
        <HomeParallaxBleedImage
          src="/images/staff-rev.jpg"
          alt=""
          wrapperClassName="absolute inset-0 z-0"
          options={{
            parallaxFactor: 0.042,
            maxOffsetPx: 44,
            scale: 1,
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-black/30"
          aria-hidden
        />
        <ScrollReveal className="relative z-10 w-full min-w-0">
          <div className="relative w-full px-6 pb-10 md:px-16 md:pb-14 lg:pb-20">
            <div className="mx-auto w-full max-w-[1400px] text-center text-white">
            <h2 className="cc-heading-sm text-white">
              Experience what care should feel like.
            </h2>
            <a
              href="/book"
              className="mt-10 cc-btn-primary-white px-6 py-3.5"
            >
              Book an evaluation
            </a>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <Footer className="home-editorial-stack-layer relative z-[9]" />
      </main>
    </div>
  );
}
