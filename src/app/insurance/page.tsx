import Footer from "../components/Footer";
import InsuranceClient from "./components/InsuranceClient";

export const metadata = {
  title: "Insurance — Common Care",
  description:
    "Out-of-network care with complimentary benefits checks, clear cost estimates, and claims handled for you.",
};

export default function InsurancePage() {
  return (
    <div className="min-h-screen gradient-page relative care-page care-page--editorial-16">
      <main className="relative z-10">
        <section className="care-stacked-panel care-stacked-panel--no-hero relative z-20">
          <InsuranceClient />
        </section>
        <Footer />
      </main>
    </div>
  );
}
