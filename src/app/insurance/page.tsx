import Link from "next/link";

export default function InsurancePage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="px-16 py-20 md:py-28">
        <h1 className="text-4xl md:text-5xl text-darkgreen max-w-2xl">
          Insurance
        </h1>
        <p className="mt-6 text-xl opacity-90 leading-relaxed max-w-xl">
          Insurance, simplified.
        </p>

        <section className="mt-24 pt-16 border-t border-matcha/10">
          <h2 className="text-2xl md:text-3xl text-darkgreen">How it works</h2>
          <p className="mt-4 text-lg opacity-90 leading-relaxed max-w-2xl">
            Placeholder: We verify eligibility and help you understand your coverage within 24 hours.
          </p>
        </section>

        <section id="deductible" className="mt-20">
          <h2 className="text-2xl md:text-3xl text-darkgreen">Deductible basics</h2>
          <p className="mt-4 text-lg opacity-90 leading-relaxed max-w-2xl">
            Placeholder: Clear explanation of deductibles and out-of-pocket.
          </p>
        </section>

        <section id="eligibility" className="mt-20">
          <h2 className="text-2xl md:text-3xl text-darkgreen">Eligibility check</h2>
          <p className="mt-4 text-lg opacity-90 leading-relaxed max-w-2xl">
            Submit your info. We'll follow up within 24 hours.
          </p>
          <Link
            href="#eligibility"
            className="mt-6 inline-flex rounded-full bg-matcha px-6 py-3 text-base font-medium text-light-green hover:opacity-95"
          >
            Check eligibility
          </Link>
        </section>

        <section id="faq" className="mt-20">
          <h2 className="text-2xl md:text-3xl text-darkgreen">FAQ</h2>
          <div className="mt-8 space-y-8">
            <div className="border-t border-matcha/10 pt-6">
              <h3 className="font-hero-display text-[24px] font-medium text-darkgreen">Do you take insurance?</h3>
              <p className="mt-2 text-lg opacity-90 leading-relaxed">
                We verify eligibility and help you understand your coverage. Submit the form and our billing team will follow up.
              </p>
            </div>
            <div className="border-t border-matcha/10 pt-6">
              <h3 className="font-hero-display text-[24px] font-medium text-darkgreen">How long does verification take?</h3>
              <p className="mt-2 text-lg opacity-90 leading-relaxed">
                Typically within 24 hours.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
