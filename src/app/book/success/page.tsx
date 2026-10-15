import Link from "next/link";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import Footer from "../../components/Footer";

export const metadata = {
  title: "Book an evaluation — Request received",
  description:
    "Your evaluation request has been received. We’ll reach out shortly to schedule your visit and follow up within 1-2 business days.",
};

export default function BookEvaluationSuccessPage() {
  return (
    <div className="flex min-h-screen flex-col gradient-page relative care-page care-page--editorial-16">
      <main className="relative z-10 flex min-h-0 flex-1 flex-col">
        <section className="care-stacked-panel care-stacked-panel--no-hero relative z-20 flex min-h-0 flex-1 flex-col">
          <div className="w-full px-6 md:px-16">
            <div className="mx-auto max-w-[1400px] pb-24 md:pb-32 pt-8 md:pt-12 flex justify-center">
              <div className="min-w-0 max-w-xl text-center md:text-left">
                <p className="cc-eyebrow mb-3 md:mb-4">Book an evaluation</p>
                <div className="flex items-center justify-center md:justify-start gap-3 md:gap-4">
                  <CheckCircleIcon
                    className="h-7 w-7 shrink-0 text-darkgreen"
                    aria-hidden
                  />
                  <h1 className="cc-heading-md text-darkgreen !mb-0">
                    Your request has been received
                  </h1>
                </div>

                <p className="care-body text-forest/90 max-w-xl !mt-4">
                  We&apos;ll reach out shortly to schedule your visit and find a
                  time that works best for you. We&apos;ll typically follow up
                  within 1-2 business days.
                </p>
                <p className="care-body text-forest/90 max-w-xl !mt-4">
                  In the meantime, you can get a sense of what your first visit
                  will feel like.
                </p>

                <div className="mt-8">
                  <Link href="/first-visit" className="cc-btn-primary px-6 py-3">
                    Explore your first visit
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </div>
  );
}
