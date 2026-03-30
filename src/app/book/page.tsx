import Link from "next/link";

export default function BookPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="px-16 py-20 md:py-28">
        <h1 className="cc-heading-lg text-darkgreen max-w-2xl">
          Book
        </h1>

        <section className="mt-16">
          <p className="text-lg opacity-90 leading-relaxed max-w-xl">
            Begin with a Care Evaluation.
          </p>
          <Link
            href="#"
            className="mt-6 inline-flex rounded-full bg-matcha px-6 py-3.5 text-base font-medium text-light-green hover:opacity-95"
          >
            Book an evaluation
          </Link>
        </section>

        <section className="mt-24 pt-16 border-t border-matcha/10 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="cc-heading-minor text-darkgreen font-medium">Contact</h2>
            <p className="mt-3 text-lg opacity-90">hello@commoncare.co</p>
            <p className="mt-1 text-lg opacity-90">(310) 544-1001</p>
          </div>
          <div>
            <h2 className="cc-heading-minor text-darkgreen font-medium">Hours & location</h2>
            <p className="mt-3 text-lg opacity-90 leading-relaxed">
              Los Angeles, CA 90028. In-person sessions. Hours placeholder.
            </p>
            <p className="mt-2 text-sm opacity-70">Location and parking details.</p>
          </div>
        </section>

        <p className="mt-16 text-lg opacity-80 leading-relaxed max-w-xl">
          What to expect: Your first visit is comprehensive and unhurried. We evaluate movement, posture, and lifestyle to understand the full picture.{" "}
          <Link href="/first-visit" className="text-darkgreen underline underline-offset-2 hover:opacity-80">
            Learn more
          </Link>
          .
        </p>
      </main>
    </div>
  );
}
