import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full absolute top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/kc-logo-v3.png"
            alt="Kings Court"
            width={40}
            height={40}
            className="rounded-lg brightness-110"
          />
          <span className="text-base font-semibold tracking-tight text-white">
            Kings Court Boston
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-white/70">
          <Link href="/join" className="hover:text-white transition">
            Join
          </Link>
          <Link href="/perks" className="hover:text-white transition">
            Perks
          </Link>
        </nav>
      </div>
    </header>
  );
}
