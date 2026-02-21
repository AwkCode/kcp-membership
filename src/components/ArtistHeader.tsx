import Image from "next/image";
import Link from "next/link";

export default function ArtistHeader() {
  return (
    <header className="w-full sticky top-0 z-50 header-glass border-b border-kc-purple/10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 sm:gap-3">
          <Image
            src="/kc-logo-v3.png"
            alt="Kings Court"
            width={36}
            height={36}
            className="rounded"
          />
          <span className="text-sm sm:text-base font-semibold tracking-tight text-white">
            Kings Court
          </span>
          <span className="text-[10px] bg-kc-purple/15 text-kc-purple-light px-2 py-0.5 rounded-full border border-kc-purple/25">
            Artist
          </span>
        </Link>
        <nav className="flex items-center gap-3 sm:gap-5 text-xs sm:text-sm font-medium text-white/50">
          <Link href="/" className="hover:text-white transition">
            Home
          </Link>
          <Link href="/shows" className="hover:text-white transition">
            Shows
          </Link>
          <Link href="/artists/bookings" className="hover:text-white transition">
            My Spots
          </Link>
          <Link href="/artists/profile" className="hover:text-white transition">
            Profile
          </Link>
        </nav>
      </div>
    </header>
  );
}
