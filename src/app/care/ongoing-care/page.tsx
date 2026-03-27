import Link from "next/link";

export default function OngoingCarePage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="px-16 py-20 md:py-28">
        <h1 className="cc-heading-lg text-darkgreen max-w-2xl">
          Care Sessions
        </h1>
        <p className="mt-6 text-xl opacity-90 leading-relaxed max-w-xl">
          One-on-one sessions built around you, combining hands-on care, movement, and advanced technology to support how your body heals.
        </p>

        <section className="mt-[120px] pt-[120px] border-t border-matcha/10">
          <h2 className="cc-heading-md text-darkgreen">How we work together</h2>
          <p className="mt-4 text-lg opacity-90 leading-relaxed max-w-2xl">
            Placeholder: Follow-up sessions, home support, and a plan that adapts to you.
          </p>
        </section>

        <section className="mt-[120px]">
          <h2 className="cc-heading-md text-darkgreen">Frequency and focus</h2>
          <p className="mt-4 text-lg opacity-90 leading-relaxed max-w-2xl">
            Placeholder: From recovery to maintenance — we match the rhythm to your goals.
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
