import Link from "next/link";

export default function Evaluation360Page() {
  return (
    <div className="min-h-screen bg-background">
      <main className="px-16 py-20 md:py-28">
        <h1 className="text-4xl md:text-5xl text-darkgreen max-w-2xl">
          The 360° Evaluation
        </h1>
        <p className="mt-6 text-xl opacity-90 leading-relaxed max-w-xl">
          A comprehensive look at how you move and how we can help.
        </p>

        <section className="mt-24 pt-16 border-t border-matcha/10">
          <h2 className="text-2xl md:text-3xl text-darkgreen">What we evaluate</h2>
          <p className="mt-4 text-lg opacity-90 leading-relaxed max-w-2xl">
            Placeholder: Movement, posture, lifestyle factors, and goals — the full picture before we recommend next steps.
          </p>
        </section>

        <section className="mt-20">
          <h2 className="text-2xl md:text-3xl text-darkgreen">What to expect</h2>
          <p className="mt-4 text-lg opacity-90 leading-relaxed max-w-2xl">
            Placeholder: Unhurried, thorough, and built around your priorities.
          </p>
        </section>

        <section className="mt-24 pt-16 border-t border-matcha/10">
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
