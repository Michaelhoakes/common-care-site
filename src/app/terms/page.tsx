import Footer from "../components/Footer";

export const metadata = {
  title: "Terms of Service — Common Care",
  description:
    "Terms governing the use of Common Care's website, communications, appointments, and services.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen gradient-page relative care-page care-page--editorial-16">
      <main className="relative z-10">
        <section className="care-stacked-panel care-stacked-panel--no-hero relative z-20">
          <div className="w-full px-6 md:px-16">
            <article className="privacy-policy-content mx-auto max-w-2xl pb-24 md:pb-32 pt-8 md:pt-10">
              <h1 className="cc-heading-compact text-darkgreen">
                Terms of Service
              </h1>
              <p className="mt-4 text-sm text-darkgreen !mb-0">
                Last updated: March 30, 2026
              </p>

              <div className="mt-8 space-y-8">
                <div className="care-body text-darkgreen space-y-4 [&_p]:!mb-0">
                  <p>
                    Welcome to Common Care. By accessing or using our website,
                    you agree to the following terms.
                  </p>
                </div>

                <section className="space-y-4">
                  <h2 className="cc-heading-ms text-darkgreen !mb-0">
                    Use of this website
                  </h2>
                  <div className="care-body text-darkgreen space-y-4 [&_p]:!mb-0">
                    <p>
                      This website is intended to provide general information
                      about our services.
                    </p>
                    <p>
                      By using this site, you agree to use it only for lawful
                      purposes and in a way that does not infringe on the rights
                      of others or restrict their use of the site.
                    </p>
                  </div>
                </section>

                <section className="space-y-4">
                  <h2 className="cc-heading-ms text-darkgreen !mb-0">
                    No medical advice
                  </h2>
                  <div className="care-body text-darkgreen space-y-4 [&_p]:!mb-0">
                    <p>
                      Content on this website is provided for informational
                      purposes only and should not be considered medical advice.
                    </p>
                    <p>
                      Use of this website does not establish a provider-patient
                      relationship. A formal relationship is established only
                      after an evaluation and agreement to receive care.
                    </p>
                  </div>
                </section>

                <section className="space-y-4">
                  <h2 className="cc-heading-ms text-darkgreen !mb-0">
                    Emergency care
                  </h2>
                  <p className="care-body text-darkgreen !mb-0">
                    If you are experiencing a medical emergency, call 911 or
                    seek immediate medical attention.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="cc-heading-ms text-darkgreen !mb-0">
                    Appointments and services
                  </h2>
                  <div className="care-body text-darkgreen space-y-4 [&_p]:!mb-0">
                    <p>All services are provided by appointment only.</p>
                    <p>
                      Submitting a form or inquiry does not guarantee
                      availability or confirm an appointment.
                    </p>
                    <p>
                      We reserve the right to modify or decline service requests
                      at our discretion.
                    </p>
                  </div>
                </section>

                <section className="space-y-4">
                  <h2 className="cc-heading-ms text-darkgreen !mb-0">
                    Cancellation and rescheduling
                  </h2>
                  <div className="care-body text-darkgreen space-y-4 [&_p]:!mb-0">
                    <p>
                      We ask that any cancellations or rescheduling requests be
                      made at least 24 hours in advance.
                    </p>
                    <p>
                      If an appointment is not cancelled or rescheduled at least
                      24 hours prior to the scheduled time, we reserve the right
                      to charge the full session rate.
                    </p>
                  </div>
                </section>

                <section className="space-y-4">
                  <h2 className="cc-heading-ms text-darkgreen !mb-0">
                    Payments and insurance
                  </h2>
                  <div className="care-body text-darkgreen space-y-4 [&_p]:!mb-0">
                    <p>Common Care operates as a cash-based provider.</p>
                    <p>
                      If insurance information is collected, it is used to help
                      verify potential out-of-network benefits. Coverage and
                      reimbursement are not guaranteed.
                    </p>
                    <p>
                      Patients are responsible for payment for services provided.
                    </p>
                  </div>
                </section>

                <section className="space-y-4">
                  <h2 className="cc-heading-ms text-darkgreen !mb-0">
                    Third-party services
                  </h2>
                  <p className="care-body text-darkgreen !mb-0">
                    We may use third-party tools and platforms to operate our
                    website and services. We are not responsible for the content
                    or practices of these third parties.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="cc-heading-ms text-darkgreen !mb-0">
                    Limitation of liability
                  </h2>
                  <p className="care-body text-darkgreen !mb-0">
                    To the fullest extent permitted by law, Common Care and
                    MOCEAN LA Wellness Corp. are not liable for any indirect,
                    incidental, or consequential damages arising from your use
                    of this website.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="cc-heading-ms text-darkgreen !mb-0">
                    Intellectual property
                  </h2>
                  <p className="care-body text-darkgreen !mb-0">
                    All content on this website, including text, design,
                    branding, and visuals, is the property of Common Care and
                    may not be copied, reproduced, or distributed without
                    permission.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="cc-heading-ms text-darkgreen !mb-0">
                    Changes to these terms
                  </h2>
                  <p className="care-body text-darkgreen !mb-0">
                    We may update these Terms from time to time. Continued use
                    of the website constitutes acceptance of any updates.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="cc-heading-ms text-darkgreen !mb-0">
                    Contact
                  </h2>
                  <p className="care-body text-darkgreen !mb-0">
                    If you have any questions about these Terms, please contact:
                  </p>
                  <ul className="privacy-bullets mt-4 text-darkgreen space-y-2 !mb-0 [&>li]:!m-0">
                    <li>MOCEAN LA Wellness Corp.</li>
                    <li>
                      <a
                        href="mailto:Hello@commoncare.co"
                        className="text-darkgreen !underline decoration-darkgreen/40 underline-offset-2 transition-none hover:opacity-90"
                      >
                        Hello@commoncare.co
                      </a>
                    </li>
                  </ul>
                </section>
              </div>
            </article>
          </div>
        </section>
        <Footer />
      </main>
    </div>
  );
}
