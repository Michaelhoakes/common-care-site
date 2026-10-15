import Link from "next/link";
import Image from "next/image";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import Footer from "../components/Footer";
import SmoothHashLink from "../components/SmoothHashLink";
import BookEvaluationForm from "./components/BookEvaluationForm";

export const metadata = {
  title: "Book an evaluation — Common Care",
  description:
    "Book your care evaluation. Share a few details and we’ll follow up personally within 24 hours.",
};

export default function BookPage() {
  return (
    <div className="min-h-screen gradient-page relative care-page care-page--editorial-16">
      <main className="relative z-10">
        <section className="care-stacked-panel care-stacked-panel--no-hero relative z-20">
          <div className="w-full px-6 md:px-16">
            <div className="mx-auto max-w-[1400px] pb-24 md:pb-32 pt-8 md:pt-10">
              <h1 className="cc-heading-compact text-darkgreen max-w-3xl">
                Book your care evaluation
              </h1>
              <p className="care-body text-darkgreen/90 max-w-3xl">
                This is an extended, one-on-one visit designed to understand what&apos;s going on,
                connect the bigger picture of your health, and begin moving you forward
                with clarity.
              </p>

              <div className="mt-8">
                <SmoothHashLink
                  href="#book-evaluation"
                  className="cc-btn-primary px-6 py-3"
                >
                  Request evaluation
                </SmoothHashLink>
              </div>

              <div
                className="my-10 md:my-20 border-t border-forest/10"
                aria-hidden
              />

              <section className="care-section scroll-mt-28">
                <div className="mt-4 md:mt-8 grid gap-y-8 gap-x-10 lg:grid-cols-12 lg:items-center">
                  <div className="hidden md:flex lg:col-span-6 items-center">
                    <div className="w-full aspect-[3/2] rounded-2xl overflow-hidden border border-forest/10 bg-forest/[0.03]">
                      <Image
                        src="/images/treatmenttable1-opt.jpg"
                        alt="Common Care clinic"
                        width={800}
                        height={600}
                        className="h-full w-full object-cover object-center scale-[1.7]"
                        priority={false}
                      />
                    </div>
                  </div>

                  <div className="lg:col-span-6 flex flex-col justify-center">
                    <h2 className="cc-heading-md text-darkgreen text-left !mb-0 pb-5">
                      What this visit includes
                    </h2>
                    <ul className="!mt-0 care-list text-darkgreen flex flex-col items-start gap-3 list-none p-0 [&>li+li]:!m-0">
                      <li className="flex gap-3 items-start justify-start">
                      <span
                        className="mt-0.5 flex shrink-0 text-matcha"
                        aria-hidden
                      >
                        <CheckCircleIcon className="h-5 w-5" />
                      </span>
                      <span>One-on-one with a Doctor of Physical Therapy</span>
                      </li>
                      <li className="flex gap-3 items-start justify-start">
                      <span
                        className="mt-0.5 flex shrink-0 text-matcha"
                        aria-hidden
                      >
                        <CheckCircleIcon className="h-5 w-5" />
                      </span>
                      <span>Extended, unrushed time to look beyond symptoms</span>
                      </li>
                      <li className="flex gap-3 items-start justify-start">
                      <span
                        className="mt-0.5 flex shrink-0 text-matcha"
                        aria-hidden
                      >
                        <CheckCircleIcon className="h-5 w-5" />
                      </span>
                      <span>A full look at your health, symptoms, and goals</span>
                      </li>
                      <li className="flex gap-3 items-start justify-start">
                      <span
                        className="mt-0.5 flex shrink-0 text-matcha"
                        aria-hidden
                      >
                        <CheckCircleIcon className="h-5 w-5" />
                      </span>
                      <span>Clear next steps and a plan forward</span>
                      </li>
                    </ul>
                    <Link
                      href="/first-visit#what-to-expect"
                      className="mt-5 mb-2 md:mb-0 cc-text-btn !inline-flex items-center gap-1.5 group/link transition-opacity duration-300 ease-out hover:opacity-80 w-fit"
                    >
                      What to expect during your first visit →
                    </Link>
                  </div>
                </div>
              </section>

              <div
                className="my-10 md:my-20 border-t border-forest/10"
                aria-hidden
              />

              <section
                id="book-evaluation"
                className="care-section scroll-mt-28"
              >
                <h2 className="cc-heading-md text-darkgreen text-left md:text-center">
                  Request your evaluation
                </h2>
                <p className="care-body text-darkgreen/90 max-w-2xl md:mx-auto text-left md:text-center">
                  Share a few details and we&apos;ll follow up within 24 hours with next steps, including available times and a clear path forward.
                </p>
                <div className="flex justify-center flex-col items-center">
                  <BookEvaluationForm />
                </div>
              </section>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </div>
  );
}
