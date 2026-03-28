import CarePageClient from "./components/CarePageClient";
import Footer from "../components/Footer";

export const metadata = {
  title: "Care — Common Care",
  description:
    "How care unfolds here: Care Evaluation, one-on-one Care Sessions, and Recovery Care — designed for long-term health.",
};

export default function CarePage() {
  return (
    <div className="min-h-screen gradient-page relative care-page">
      <main className="relative z-10">
        {/* Top hero image: full-bleed, edge-to-edge */}
        <section className="relative h-[56vh] min-h-[460px] max-h-[720px] w-full overflow-hidden">
          <div
            className="absolute inset-0 bg-cover care-parallax-media care-parallax-hero"
            style={{
              backgroundImage: "url('/images/treatmenttable3-opt.jpg')",
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
                How care unfolds here.
              </h1>
            </div>
          </div>
        </section>

        <section className="care-stacked-panel relative z-20">
          <CarePageClient />
        </section>
        <Footer />
      </main>
    </div>
  );
}
