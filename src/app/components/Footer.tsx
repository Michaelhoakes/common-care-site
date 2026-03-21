import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-marigold text-darkgreen py-[40px]">
      <div className="w-full px-6 md:px-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          <div className="md:col-span-4 flex flex-col">
            <Link href="/" className="block w-full max-w-[140px] mb-4" aria-label="Common Care — Home">
              <Image
                src="/CommonCare_Logo_DarkGreen_Tight.svg"
                alt="Common Care"
                width={792}
                height={350}
                className="w-full h-auto"
              />
            </Link>
          </div>

          <div className="md:col-start-7 md:col-span-2">
            <p className="text-xs font-mono font-medium tracking-widest uppercase opacity-60 mb-4" style={{ fontWeight: 500 }}>Navigate</p>
            <div className="flex flex-col gap-2 text-sm">
              <Link className="opacity-80 hover:opacity-100" href="/care">Care</Link>
              <Link className="opacity-80 hover:opacity-100" href="/first-visit">First Visit</Link>
              <Link className="opacity-80 hover:opacity-100" href="/about">About</Link>
              <Link className="opacity-80 hover:opacity-100" href="/insurance">Insurance</Link>
              <Link className="opacity-80 hover:opacity-100" href="/book">Book an evaluation</Link>
            </div>
          </div>

          <div className="md:col-span-2">
            <p className="text-xs font-mono font-medium tracking-widest uppercase opacity-60 mb-4" style={{ fontWeight: 500 }}>Details</p>
            <div className="flex flex-col gap-2 text-sm opacity-80">
              <p>Los Angeles area</p>
              <p>In-person sessions</p>
              <p>60–90 min per visit</p>
            </div>
          </div>

          <div className="md:col-span-2 flex flex-col">
            <p className="text-xs font-mono font-medium tracking-widest uppercase opacity-60 mb-4" style={{ fontWeight: 500 }}>Contact</p>
            <div className="flex flex-col gap-2 text-sm opacity-80">
              <a className="hover:opacity-100" href="mailto:hello@commoncare.co">hello@commoncare.co</a>
              <a className="hover:opacity-100" href="tel:+13105551234">(310) 555-1234</a>
              <p>Los Angeles, CA 90028</p>
            </div>
          </div>
        </div>

        <div className="mt-[24px] pt-[24px] border-t border-darkgreen/20 text-xs opacity-60">
          © {new Date().getFullYear()} Common Care
        </div>
      </div>
    </footer>
  );
}
