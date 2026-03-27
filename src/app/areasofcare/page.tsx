import Link from "next/link";

const CATEGORIES = [
  { id: "neck-back", title: "Neck & back" },
  { id: "shoulders", title: "Shoulders" },
  { id: "hips-knees", title: "Hips & knees" },
  { id: "stress-posture", title: "Stress & posture" },
  { id: "return-to-sport", title: "Return to sport" },
  { id: "preventative", title: "Preventative" },
];

export default function AreasOfCarePage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="px-16 py-20 md:py-28">
        <h1 className="cc-heading-lg text-darkgreen max-w-2xl">
          Areas of care
        </h1>
        <p className="mt-6 text-xl opacity-90 leading-relaxed max-w-xl">
          Common concerns we address — curated and clear.
        </p>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-12">
          {CATEGORIES.map((cat) => (
            <section key={cat.id} id={cat.id} className="border-t border-matcha/10 pt-8">
              <h2 className="cc-heading-xs text-darkgreen">{cat.title}</h2>
              <p className="mt-3 text-lg opacity-80 leading-relaxed">
                Placeholder: Short description for this area of care.
              </p>
            </section>
          ))}
        </div>

        <section className="mt-24 pt-16 border-t border-matcha/10">
          <Link
            href="/book"
            className="inline-flex rounded-full bg-matcha px-6 py-3 text-base font-medium text-light-green hover:opacity-95"
          >
            Book an evaluation
          </Link>
        </section>
      </main>
    </div>
  );
}
