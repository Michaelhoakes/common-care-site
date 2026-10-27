import Image from "next/image";
import Link from "next/link";
import AboutNavLink from "./AboutNavLink";

export default function Footer({ className = "" }: { className?: string }) {
  return (
    <footer className={`bg-darkgreen py-[40px] text-white ${className}`.trim()}>
      <div className="w-full px-6 md:px-16">
        <div className="mx-auto grid w-full max-w-[1400px] grid-cols-2 gap-x-8 gap-y-6 md:grid-cols-12 md:gap-x-8 md:gap-y-0 md:items-start">
          <div className="col-span-2 md:col-span-4">
            <Link href="/" className="mb-2 block w-full max-w-[140px] font-medium md:mb-4" aria-label="Common Care — Home">
              <Image
                src="/CommonCare_Logo_White.svg"
                alt="Common Care"
                width={792}
                height={350}
                className="h-auto w-full"
              />
            </Link>
          </div>

          <div className="col-span-1 md:col-span-2 md:col-start-6">
            <p className="cc-footer-nav-label !mb-2 text-white md:!mb-4">Care</p>
            <div className="flex flex-col gap-2 text-sm font-medium">
              <Link
                className="text-white/85 hover:text-white transition-none"
                href="/care"
              >
                How we care
              </Link>
              <Link
                className="text-white/85 hover:text-white transition-none"
                href="/first-visit"
              >
                First Visit
              </Link>
              <Link
                className="text-white/85 hover:text-white transition-none"
                href="/insurance"
              >
                Insurance
              </Link>
            </div>
          </div>

          <div className="col-span-1 md:col-span-2 md:col-start-8">
            <p className="cc-footer-nav-label !mb-2 text-white md:!mb-4">About</p>
            <div className="flex flex-col gap-2 text-sm font-medium">
              <AboutNavLink
                className="text-white/85 hover:text-white transition-none"
                href="/about#care-team"
              >
                Your care team
              </AboutNavLink>
              <AboutNavLink
                className="text-white/85 hover:text-white transition-none"
                href="/about#what-we-believe"
              >
                Our beliefs
              </AboutNavLink>
            </div>
          </div>

          <div className="col-span-2 md:col-span-3 md:col-start-10">
            <p className="cc-footer-nav-label !mb-2 text-white md:!mb-4">Contact</p>
            <div className="grid grid-cols-2 gap-x-8 text-sm text-white/80 md:grid-cols-1 md:gap-x-0 md:gap-y-3">
              <div className="flex min-w-0 flex-col gap-3 md:gap-4">
                <div className="flex flex-col gap-1">
                  <a
                    className="font-medium hover:text-white transition-none"
                    href="mailto:Hello@commoncare.co"
                    aria-label="Email Hello@commoncare.co"
                  >
                    Hello@commoncare.co
                  </a>
                  <a
                    className="font-medium hover:text-white transition-none"
                    href="tel:+13235441001"
                  >
                    (323) 544-1001
                  </a>
                </div>
                <p className="!m-0">
                  7551 Sunset Blvd #201
                  <br />
                  Los Angeles, CA 90046
                </p>
              </div>
              <div className="flex min-w-0 flex-col gap-1">
                <p className="!m-0 font-medium">By appointment only</p>
                <p className="!m-0">Mon–Fri, 9am–6pm</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 w-full border-t border-white/15 md:mt-16">
        <div className="w-full px-6 pt-8 md:px-16 md:pt-6">
          <div className="mx-auto flex w-full max-w-[1400px] flex-wrap items-center gap-x-6 gap-y-3 text-xs text-white/60">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <span>© {new Date().getFullYear()} Common Care</span>
              <span aria-hidden className="text-white/50">
                ·
              </span>
              <Link
                href="/privacy"
                className="text-white/60 hover:text-white/80 transition-none"
              >
                Privacy Policy
              </Link>
              <span aria-hidden className="text-white/50">
                ·
              </span>
              <Link
                href="/terms"
                className="text-white/60 hover:text-white/80 transition-none"
              >
                Terms of Service
              </Link>
            </div>
            <a
              href="https://www.instagram.com/thecommoncare/"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto shrink-0 text-white/60 hover:text-white/80 transition-none"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
