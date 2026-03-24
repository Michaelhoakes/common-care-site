import Link from "next/link";
import Footer from "../components/Footer";

export default function InsurancePage() {
  return (
    <div className="min-h-screen gradient-page relative care-page">
      <main className="relative z-10">
        <section className="care-stacked-panel care-stacked-panel--no-hero relative z-20">
          <div className="w-full px-6 md:px-16">
            <div className="mx-auto max-w-[1400px] pb-24 md:pb-32 pt-8 md:pt-10">
              <h1 className="font-hero-display text-4xl sm:text-5xl md:text-6xl text-darkgreen font-semibold max-w-3xl">
                Insurance
              </h1>
              <p className="care-lead text-forest/90 mt-4 md:mt-5">
                Insurance, simplified.
              </p>

              <div
                className="mt-24 md:mt-32 pt-16 md:pt-20 border-t border-forest/10"
                aria-hidden
              />

              <section className="care-section scroll-mt-28">
                <h3>How it works</h3>
                <p className="care-body text-forest/90">
                  Placeholder: We verify eligibility and help you understand
                  your coverage within 24 hours.
                </p>
              </section>

              <div
                className="mt-24 md:mt-32 pt-16 md:pt-20 border-t border-forest/10"
                aria-hidden
              />

              <section
                id="deductible"
                className="care-section scroll-mt-28"
              >
                <h3>Deductible basics</h3>
                <p className="care-body text-forest/90">
                  Placeholder: Clear explanation of deductibles and
                  out-of-pocket.
                </p>
              </section>

              <div
                className="mt-24 md:mt-32 pt-16 md:pt-20 border-t border-forest/10"
                aria-hidden
              />

              <section
                id="eligibility"
                className="care-section scroll-mt-28"
              >
                <h3>Eligibility check</h3>
                <p className="care-body text-forest/90">
                  Submit your info. We&apos;ll follow up within 24 hours.
                </p>
                <Link
                  href="#eligibility"
                  className="mt-6 inline-flex cc-btn-primary"
                >
                  Check eligibility
                </Link>
              </section>

              <div
                className="mt-24 md:mt-32 pt-16 md:pt-20 border-t border-forest/10"
                aria-hidden
              />

              <section id="faq" className="care-section scroll-mt-28">
                <h3>FAQ</h3>
                <div className="mt-6 flex flex-col gap-8">
                  <div>
                    <p className="font-medium text-darkgreen text-[17px] leading-snug">
                      Do you take insurance?
                    </p>
                    <p className="care-body text-forest/90 mt-2">
                      We verify eligibility and help you understand your
                      coverage. Submit the form and our billing team will follow
                      up.
                    </p>
                  </div>
                  <div className="pt-8 border-t border-forest/10">
                    <p className="font-medium text-darkgreen text-[17px] leading-snug">
                      How long does verification take?
                    </p>
                    <p className="care-body text-forest/90 mt-2">
                      Typically within 24 hours.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </div>
  );
}
