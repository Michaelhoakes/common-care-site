import Footer from "../components/Footer";

export const metadata = {
  title: "Privacy Policy — Common Care",
  description:
    "How Common Care collects, uses, and protects your information when you use our website and services.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen gradient-page relative care-page care-page--editorial-16">
      <main className="relative z-10">
        <section className="care-stacked-panel care-stacked-panel--no-hero relative z-20">
          <div className="w-full px-6 md:px-16">
            <article className="privacy-policy-content mx-auto max-w-2xl pb-24 md:pb-32 pt-8 md:pt-10">
              <h1 className="cc-heading-compact text-darkgreen">
                Privacy Policy
              </h1>
              <p className="mt-4 text-sm text-darkgreen !mb-0">
                Last updated: March 30, 2026
              </p>

              <div className="mt-8 space-y-8">
                <div className="care-body text-darkgreen space-y-4 [&_p]:!mb-0">
                  <p>
                    Common Care (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or
                    &ldquo;our&rdquo;) is operated by MOCEAN LA Wellness Corp. We
                    respect your privacy and are committed to protecting your
                    information. This Privacy Policy explains what information we
                    collect, how we use it, and how we handle it.
                  </p>
                </div>

                <section className="space-y-4">
                  <h2 className="cc-heading-ms text-darkgreen !mb-0">
                    Information we collect
                  </h2>
                  <p className="care-body text-darkgreen !mb-0">
                    We collect information you provide directly to us, as well as
                    limited information collected automatically through your use of
                    our website.
                  </p>
                  <p className="care-body text-darkgreen !mb-0">
                    Information you may provide includes:
                  </p>
                  <ul className="privacy-bullets mt-4 text-darkgreen space-y-2 !mb-0 [&>li]:!m-0">
                    <li>Name</li>
                    <li>Email address</li>
                    <li>Phone number</li>
                    <li>Date of birth</li>
                    <li>Address</li>
                    <li>
                      Information about your health concerns or reason for seeking
                      care
                    </li>
                    <li className="!mt-3">
                      <span className="font-medium text-darkgreen">
                        Insurance information (if provided), including:
                      </span>
                      <ul className="mt-3 space-y-2 pl-0 list-none [&>li]:!m-0">
                        <li className="flex gap-2">
                          <span className="text-matcha shrink-0" aria-hidden>
                            —
                          </span>
                          <span>Insurance provider</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-matcha shrink-0" aria-hidden>
                            —
                          </span>
                          <span>Member ID</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-matcha shrink-0" aria-hidden>
                            —
                          </span>
                          <span>Group number</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-matcha shrink-0" aria-hidden>
                            —
                          </span>
                          <span>Policyholder details</span>
                        </li>
                      </ul>
                    </li>
                  </ul>
                  <p className="care-body text-darkgreen !mb-0 pt-2">
                    Information collected automatically may include:
                  </p>
                  <ul className="privacy-bullets mt-4 text-darkgreen space-y-2 !mb-0 [&>li]:!m-0">
                    <li>Browser type</li>
                    <li>Device type</li>
                    <li>General website usage data</li>
                  </ul>
                </section>

                <section className="space-y-4">
                  <h2 className="cc-heading-ms text-darkgreen !mb-0">
                    How we use your information
                  </h2>
                  <p className="care-body text-darkgreen !mb-0">
                    We use your information to:
                  </p>
                  <ul className="privacy-bullets mt-4 text-darkgreen space-y-2 !mb-0 [&>li]:!m-0">
                    <li>Respond to your inquiry or request</li>
                    <li>Coordinate scheduling and care</li>
                    <li>Verify insurance benefits (if applicable)</li>
                    <li>Communicate with you about your visit</li>
                    <li>Improve our services and website</li>
                  </ul>
                  <p className="care-body text-darkgreen !mb-0 pt-2">
                    Information submitted through this website is used for
                    communication and coordination purposes and does not
                    constitute medical advice or establish a provider-patient
                    relationship.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="cc-heading-ms text-darkgreen !mb-0">
                    How we share your information
                  </h2>
                  <p className="care-body text-darkgreen !mb-0">
                    We do not sell your personal information.
                  </p>
                  <p className="care-body text-darkgreen !mb-0">
                    We may share your information with:
                  </p>
                  <ul className="privacy-bullets mt-4 text-darkgreen space-y-2 !mb-0 [&>li]:!m-0">
                    <li>
                      Billing and insurance partners, to verify benefits and
                      process claims
                    </li>
                    <li>
                      Service providers that support our operations (such as form
                      handling, email, and payment tools)
                    </li>
                    <li>
                      Clinical or care platforms (such as PT Care) where your
                      information may be stored and managed
                    </li>
                    <li>Legal authorities, if required by law</li>
                  </ul>
                </section>

                <section className="space-y-4">
                  <h2 className="cc-heading-ms text-darkgreen !mb-0">
                    Health information
                  </h2>
                  <div className="care-body text-darkgreen space-y-4 [&_p]:!mb-0">
                    <p>
                      If you choose to become a patient, your health-related
                      information may be collected and stored in third-party
                      systems used to support your care, including secure cloud
                      storage and clinical platforms.
                    </p>
                    <p>
                      Where applicable, your health information will be handled in
                      accordance with applicable healthcare privacy laws,
                      including HIPAA.
                    </p>
                  </div>
                </section>

                <section className="space-y-4">
                  <h2 className="cc-heading-ms text-darkgreen !mb-0">
                    Data security
                  </h2>
                  <div className="care-body text-darkgreen space-y-4 [&_p]:!mb-0">
                    <p>
                      We take reasonable administrative, technical, and physical
                      measures to protect your information.
                    </p>
                    <p>
                      However, no method of transmission over the internet or
                      electronic storage is completely secure.
                    </p>
                  </div>
                </section>

                <section className="space-y-4">
                  <h2 className="cc-heading-ms text-darkgreen !mb-0">
                    Data retention
                  </h2>
                  <p className="care-body text-darkgreen !mb-0">
                    We retain your information only as long as necessary to
                    fulfill the purposes outlined in this policy, unless a longer
                    retention period is required by law.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="cc-heading-ms text-darkgreen !mb-0">
                    Your choices
                  </h2>
                  <p className="care-body text-darkgreen !mb-0">
                    You may contact us at any time to:
                  </p>
                  <ul className="privacy-bullets mt-4 text-darkgreen space-y-2 !mb-0 [&>li]:!m-0">
                    <li>Request access to your information</li>
                    <li>Request corrections</li>
                    <li>Ask questions about how your information is used</li>
                  </ul>
                </section>

                <section className="space-y-4">
                  <h2 className="cc-heading-ms text-darkgreen !mb-0">
                    California privacy rights
                  </h2>
                  <p className="care-body text-darkgreen !mb-0">
                    If you are a California resident, you may have the right to
                    request access to or deletion of your personal information,
                    subject to certain exceptions.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="cc-heading-ms text-darkgreen !mb-0">
                    Communications
                  </h2>
                  <div className="care-body text-darkgreen space-y-4 [&_p]:!mb-0">
                    <p>
                      By submitting a form, you agree that we may contact you via
                      email, phone, or text regarding your request, scheduling, or
                      care.
                    </p>
                    <p>Standard messaging and data rates may apply.</p>
                  </div>
                </section>

                <section className="space-y-4">
                  <h2 className="cc-heading-ms text-darkgreen !mb-0">
                    Children&apos;s privacy
                  </h2>
                  <p className="care-body text-darkgreen !mb-0">
                    Our services are not directed to children under 13. We do not
                    knowingly collect personal information from children without
                    appropriate consent.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="cc-heading-ms text-darkgreen !mb-0">
                    Changes to this policy
                  </h2>
                  <p className="care-body text-darkgreen !mb-0">
                    We may update this Privacy Policy from time to time. Updates
                    will be posted on this page with a revised effective date.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="cc-heading-ms text-darkgreen !mb-0">
                    Contact
                  </h2>
                  <p className="care-body text-darkgreen !mb-0">
                    If you have any questions about this Privacy Policy, please
                    contact:
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
