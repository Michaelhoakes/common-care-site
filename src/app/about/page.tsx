import Footer from "../components/Footer";
import AboutTabs from "./components/AboutTabs";

export const metadata = {
  title: "About — Common Care",
  description:
    "Care built to last: long-horizon support, what happens between visits, and the priorities that guide how we practice.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen gradient-page relative care-page">
      <main className="relative z-10">
        <section className="care-stacked-panel care-stacked-panel--no-hero relative z-20">
          <AboutTabs />
        </section>
        <Footer />
      </main>
    </div>
  );
}
