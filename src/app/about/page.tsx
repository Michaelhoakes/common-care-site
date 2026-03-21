import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="px-16 py-20 md:py-28">
        <h1 className="text-4xl md:text-5xl text-darkgreen max-w-2xl">
          About Common Care
        </h1>
        <p className="mt-6 text-xl opacity-90 leading-relaxed max-w-xl">
          Exceptional care made common.
        </p>

        <section className="mt-24 pt-16 border-t border-matcha/10">
          <h2 className="text-2xl md:text-3xl text-darkgreen">Why we exist</h2>
          <p className="mt-4 text-lg opacity-90 leading-relaxed max-w-2xl">
            Placeholder: Mission and purpose.
          </p>
        </section>

        <section className="mt-20">
          <h2 className="text-2xl md:text-3xl text-darkgreen">Our ethos</h2>
          <p className="mt-4 text-lg opacity-90 leading-relaxed max-w-2xl">
            Placeholder: Values and approach to care.
          </p>
        </section>

        <section className="mt-20">
          <h2 className="text-2xl md:text-3xl text-darkgreen">Team</h2>
          <p className="mt-4 text-lg opacity-90 leading-relaxed max-w-2xl">
            Placeholder: Who we are.
          </p>
        </section>

        <section className="mt-20">
          <h2 className="text-2xl md:text-3xl text-darkgreen">The space</h2>
          <p className="mt-4 text-lg opacity-90 leading-relaxed max-w-2xl">
            Placeholder: Where we practice.
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
