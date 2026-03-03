"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createSupabaseBrowser } from "@/lib/supabase/client";

export default function ArtistHeader() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createSupabaseBrowser();
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <header className="w-full sticky top-0 z-50 header-glass border-b border-white/[0.15]">
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
          <span className="text-[10px] bg-white/15 text-white px-2 py-0.5 rounded-full border border-white/25">
            Artist
          </span>
        </Link>
        <nav className="flex items-center gap-3 sm:gap-5 text-xs sm:text-sm font-medium text-white/75">
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
          <Link href="/terms" className="hover:text-white transition hidden sm:block">
            Terms
          </Link>
          <button
            onClick={handleLogout}
            className="text-white/40 hover:text-red-400 transition"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}
