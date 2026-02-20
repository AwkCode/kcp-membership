import Image from "next/image";
import Link from "next/link";

export default function StaffHeader() {
  return (
    <header className="w-full sticky top-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
      <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/kc-logo-v3.png"
            alt="Kings Court"
            width={36}
            height={36}
            className="rounded"
          />
          <span className="hidden sm:inline text-base font-semibold tracking-tight text-white">
            Kings Court
          </span>
          <span className="text-[10px] bg-white/10 text-white/60 px-2 py-0.5 rounded-full border border-white/10">
            Staff
          </span>
        </Link>
        <nav className="flex items-center gap-3 sm:gap-5 text-xs sm:text-sm font-medium text-white/50">
          <Link href="/scan" className="hover:text-white transition">
            Scan
          </Link>
          <Link href="/door" className="hover:text-white transition">
            Door
          </Link>
          <Link href="/admin" className="hover:text-white transition">
            Members
          </Link>
          <Link href="/admin/shows" className="hover:text-white transition">
            Shows
          </Link>
          <Link href="/admin/comedians" className="hover:text-white transition">
            Comics
          </Link>
        </nav>
      </div>
    </header>
  );
}
