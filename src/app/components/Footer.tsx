import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-darkgreen py-[40px] text-white">
      <div className="w-full px-6 md:px-16">
        <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-12 md:grid-cols-12 md:gap-x-8 md:gap-y-0 md:items-start">
          <div className="md:col-span-4">
            <Link href="/" className="mb-4 block w-full max-w-[140px]" aria-label="Common Care — Home">
              <Image
                src="/CommonCare_Logo_White.svg"
                alt="Common Care"
                width={792}
                height={350}
                className="h-auto w-full"
              />
            </Link>
          </div>

          <div className="md:col-span-2 md:col-start-8">
            <p className="cc-footer-nav-label text-white">Care</p>
            <div className="flex flex-col gap-2 text-sm">
              <Link className="text-white/85 hover:text-white" href="/care">
                How we care
              </Link>
              <Link className="text-white/85 hover:text-white" href="/first-visit">First Visit</Link>
              <Link className="text-white/85 hover:text-white" href="/about">
                About us
              </Link>
              <Link className="text-white/85 hover:text-white" href="/about#care-team">
                Your care team
              </Link>
              <Link className="text-white/85 hover:text-white" href="/insurance">Insurance</Link>
            </div>
          </div>

          <div className="md:col-span-3 md:col-start-10">
            <p className="cc-footer-nav-label text-white">Contact</p>
            <div className="flex flex-col gap-2 text-sm text-white/80">
              <a
                className="hover:text-white"
                href="mailto:hello@commoncare.co"
                aria-label="Email us at hello@commoncare.co"
              >
                Email us
              </a>
              <a className="hover:text-white" href="tel:+13105551234">(310) 555-1234</a>
              <p>
                7551 Sunset Blvd #201
                <br />
                Los Angeles, CA 90046
              </p>
            </div>
          </div>
        </div>

        <div className="mt-[24px] text-xs text-white/60">
          © {new Date().getFullYear()} Common Care
        </div>
      </div>
    </footer>
  );
}
