import FirstVisitClient from "./components/FirstVisitClient";
import Footer from "../components/Footer";

export const metadata = {
  title: "First Visit — Common Care",
  description:
    "Practical details for your first appointment: what to expect, how to prepare, and FAQs.",
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
              backgroundImage: "url('/images/consult2a.jpg')",
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
              <h1 className="cc-heading-compact text-white max-w-3xl pb-6 md:pb-8">
                Your first visit
              </h1>
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
