import Link from "next/link";

export default function CareTeamPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="px-16 py-20 md:py-28">
        <h1 className="text-4xl md:text-5xl text-darkgreen max-w-2xl">
          Your Care Team
        </h1>
        <p className="mt-6 text-xl opacity-90 leading-relaxed max-w-xl">
          The people behind your care — experienced, attentive, and aligned with how you want to move.
        </p>

        <section className="mt-24 pt-16 border-t border-matcha/10">
          <h2 className="text-2xl md:text-3xl text-darkgreen">Who you’ll work with</h2>
          <p className="mt-4 text-lg opacity-90 leading-relaxed max-w-2xl">
            Placeholder: Our clinicians and their backgrounds — credentials, approach, and what they care about.
          </p>
        </section>

        <section className="mt-20">
          <h2 className="text-2xl md:text-3xl text-darkgreen">Continuity of care</h2>
          <p className="mt-4 text-lg opacity-90 leading-relaxed max-w-2xl">
            Placeholder: Same faces, consistent relationship — we prioritize continuity so your care feels coherent.
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
