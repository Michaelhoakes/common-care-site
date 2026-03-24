import FirstVisitClient from "./components/FirstVisitClient";
import Footer from "../components/Footer";

export const metadata = {
  title: "First Visit — Common Care",
  description:
    "What to expect, how to prepare, and everything you need to know before your first visit.",
};

export default function FirstVisitPage() {
  return (
    <div className="min-h-screen gradient-page relative care-page">
      <main className="relative z-10">
        {/* Hero: same structure, parallax, and overlay as /care */}
        <section className="relative h-[56vh] min-h-[460px] max-h-[720px] w-full overflow-hidden">
          <div
            className="absolute inset-0 bg-cover care-parallax-media care-parallax-hero"
            style={{
              backgroundImage: "url('/images/consult1.jpg')",
              backgroundPosition: "center 42%",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.1) 100%)",
            }}
            aria-hidden
          />
          <div className="absolute inset-x-0 bottom-0 z-10 px-6 md:px-16 pb-14 md:pb-16">
            <div className="mx-auto w-full max-w-[1400px]">
              <h1 className="font-hero-display text-4xl sm:text-5xl md:text-6xl text-white font-semibold max-w-3xl">
                Your first visit
              </h1>
              <p className="mt-4 md:mt-5 max-w-2xl text-lg md:text-xl text-white/85 leading-relaxed">
                What to expect, how to prepare, and everything you need to know
                before you arrive.
              </p>
            </div>
          </div>
        </section>

        <section className="care-stacked-panel relative z-20">
          <FirstVisitClient />
        </section>
        <Footer />
      </main>
    </div>
  );
}
