import Link from "next/link";

export default function EverydayWellnessPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="px-16 py-20 md:py-28">
        <h1 className="cc-heading-lg text-darkgreen max-w-2xl">
          Wellness Care
        </h1>
        <p className="mt-6 text-xl opacity-90 leading-relaxed max-w-xl">
          Sessions designed to support your nervous system, reduce stress, and help your body feel more balanced and regulated.
        </p>

        <section className="mt-[120px] pt-[120px] border-t border-matcha/10">
          <h2 className="cc-heading-md text-darkgreen">What we mean by wellness care</h2>
          <p className="mt-4 text-lg opacity-90 leading-relaxed max-w-2xl">
            Placeholder: Posture, stress, sleep, and sustainable performance — integrated into your routine.
          </p>
        </section>

        <section className="mt-[120px]">
          <h2 className="cc-heading-md text-darkgreen">Who it’s for</h2>
          <p className="mt-4 text-lg opacity-90 leading-relaxed max-w-2xl">
            Placeholder: Anyone who wants to feel better in their body without a specific injury — prevention and longevity.
          </p>
        </section>

        <section className="mt-[120px] pt-[120px] border-t border-matcha/10">
          <p className="text-lg text-darkgreen font-medium">Ready to begin?</p>
          <Link
            href="/book"
            className="mt-4 inline-flex rounded-full bg-matcha px-6 py-3 text-base font-medium text-light-green hover:opacity-95"
          >
            Book an evaluation
          </Link>
        </section>
      </main>
    </div>
  );
}
