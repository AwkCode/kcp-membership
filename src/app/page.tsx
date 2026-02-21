"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import PageShell from "@/components/PageShell";
import { createSupabaseBrowser } from "@/lib/supabase/client";

interface UserInfo {
  displayName: string;
  isArtist: boolean;
  isStaff: boolean;
}

export default function Home() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const supabase = createSupabaseBrowser();
        const { data: { user: authUser } } = await supabase.auth.getUser();

        if (!authUser) {
          setLoading(false);
          return;
        }

        // Check if they have an artist profile
        const { data: artist } = await supabase
          .from("comedians")
          .select("display_name")
          .eq("auth_id", authUser.id)
          .single();

        // Check user metadata for role
        const role = authUser.user_metadata?.role;

        setUser({
          displayName: artist?.display_name || authUser.email?.split("@")[0] || "there",
          isArtist: !!artist,
          isStaff: role === "staff" || role === "admin",
        });
      } catch {
        // not logged in, that's fine
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  return (
    <PageShell>
      <Header />
      <main className="flex flex-col items-center justify-center px-4 sm:px-6 pt-16 sm:pt-20 pb-16 sm:pb-24 min-h-screen">
        <Image
          src="/kc-logo-v3.png"
          alt="Kings Court Boston"
          width={120}
          height={120}
          className="mb-6 sm:mb-8 drop-shadow-2xl w-20 h-20 sm:w-[120px] sm:h-[120px]"
          priority
        />

        {!loading && user ? (
          <>
            {/* Logged-in experience */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-2 text-white tracking-tight">
              Welcome back, {user.displayName}
            </h1>
            <p className="text-white/50 text-sm sm:text-base text-center mb-8 sm:mb-10 max-w-md font-light">
              Where are you headed?
            </p>

            <div className="flex flex-col gap-3 w-full max-w-xs">
              {user.isStaff && (
                <>
                  <Link
                    href="/admin/dashboard"
                    className="px-8 py-3.5 bg-white text-black rounded-lg font-semibold hover:bg-white/90 transition text-center shadow-lg text-sm btn-glow"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/admin/shows"
                    className="px-8 py-3.5 bg-white/[0.06] text-white border border-kc-purple/20 rounded-lg font-semibold hover:bg-kc-purple/10 hover:border-kc-purple/30 transition text-center text-sm"
                  >
                    Manage Shows
                  </Link>
                  <Link
                    href="/scan"
                    className="px-8 py-3.5 bg-white/[0.06] text-white border border-kc-purple/20 rounded-lg font-semibold hover:bg-kc-purple/10 hover:border-kc-purple/30 transition text-center text-sm"
                  >
                    Scanner
                  </Link>
                </>
              )}

              {user.isArtist && !user.isStaff && (
                <>
                  <Link
                    href="/shows"
                    className="px-8 py-3.5 bg-white text-black rounded-lg font-semibold hover:bg-white/90 transition text-center shadow-lg text-sm btn-glow"
                  >
                    Browse Shows
                  </Link>
                  <Link
                    href="/artists/bookings"
                    className="px-8 py-3.5 bg-white/[0.06] text-white border border-kc-purple/20 rounded-lg font-semibold hover:bg-kc-purple/10 hover:border-kc-purple/30 transition text-center text-sm"
                  >
                    My Spots
                  </Link>
                  <Link
                    href="/artists/profile"
                    className="px-8 py-3.5 bg-white/[0.06] text-white border border-kc-purple/20 rounded-lg font-semibold hover:bg-kc-purple/10 hover:border-kc-purple/30 transition text-center text-sm"
                  >
                    My Profile
                  </Link>
                </>
              )}

              {!user.isArtist && !user.isStaff && (
                <Link
                  href="/join"
                  className="px-8 py-3.5 bg-white text-black rounded-lg font-semibold hover:bg-white/90 transition text-center shadow-lg text-sm btn-glow"
                >
                  Become a Member
                </Link>
              )}
            </div>

            {/* Quick links for other sections */}
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/perks" className="text-white/30 text-xs hover:text-white/60 transition">
                Perks
              </Link>
              {user.isStaff && user.isArtist && (
                <>
                  <Link href="/shows" className="text-white/30 text-xs hover:text-white/60 transition">
                    Browse Shows
                  </Link>
                  <Link href="/artists/bookings" className="text-white/30 text-xs hover:text-white/60 transition">
                    My Spots
                  </Link>
                </>
              )}
              {!user.isArtist && (
                <Link href="/artists/join" className="text-white/30 text-xs hover:text-white/60 transition">
                  Artist Sign Up
                </Link>
              )}
              {user.isArtist && !user.isStaff && (
                <Link href="/join" className="text-white/30 text-xs hover:text-white/60 transition">
                  Become a Member
                </Link>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Default / logged-out experience */}
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-center mb-3 sm:mb-4 text-white tracking-tight">
              Kings Court Boston
            </h1>
            <p className="text-white/60 text-base sm:text-lg text-center mb-8 sm:mb-12 max-w-md font-light px-4">
              Become a member. Skip the line. Unlock exclusive perks.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto px-4 sm:px-0">
              <Link
                href="/join"
                className="px-8 py-3.5 bg-white text-black rounded-lg font-semibold hover:bg-white/90 transition text-center shadow-lg text-sm btn-glow"
              >
                Become a Member
              </Link>
              <Link
                href="/perks"
                className="px-8 py-3.5 bg-white/[0.06] text-white border border-kc-purple/20 rounded-lg font-semibold hover:bg-kc-purple/10 hover:border-kc-purple/30 transition text-center text-sm"
              >
                View Perks
              </Link>
            </div>

            {/* About cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-3xl w-full px-4 sm:px-0 mt-16 sm:mt-24">
              <div className="bg-white/[0.04] rounded-2xl p-5 sm:p-6 border border-kc-purple/10 text-center hover:border-kc-purple/20 hover:bg-kc-purple/[0.04] transition">
                <div className="w-11 h-11 bg-kc-purple/10 rounded-xl flex items-center justify-center mb-3 sm:mb-4 mx-auto">
                  <svg className="w-5 h-5 text-kc-purple-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M5.636 18.364a9 9 0 010-12.728M8.464 15.536a5 5 0 010-7.072M12 12h.01" />
                  </svg>
                </div>
                <h3 className="font-medium text-white mb-1.5 text-sm">Live Events</h3>
                <p className="text-white/40 text-xs leading-relaxed">Stand-up, live music, DJs, and late-night creative culture. Every week.</p>
              </div>

              <div className="bg-white/[0.04] rounded-2xl p-5 sm:p-6 border border-kc-purple/10 text-center hover:border-kc-purple/20 hover:bg-kc-purple/[0.04] transition">
                <div className="w-11 h-11 bg-kc-purple/10 rounded-xl flex items-center justify-center mb-3 sm:mb-4 mx-auto">
                  <svg className="w-5 h-5 text-kc-purple-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="font-medium text-white mb-1.5 text-sm">Community First</h3>
                <p className="text-white/40 text-xs leading-relaxed">Built by artists, for artists. A home for Boston&apos;s underground creative scene.</p>
              </div>

              <div className="bg-white/[0.04] rounded-2xl p-5 sm:p-6 border border-kc-purple/10 text-center hover:border-kc-purple/20 hover:bg-kc-purple/[0.04] transition">
                <div className="w-11 h-11 bg-kc-purple/10 rounded-xl flex items-center justify-center mb-3 sm:mb-4 mx-auto">
                  <svg className="w-5 h-5 text-kc-purple-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="font-medium text-white mb-1.5 text-sm">Members-Only Access</h3>
                <p className="text-white/40 text-xs leading-relaxed">Skip the line, get drink deals, and hit exclusive events before anyone else.</p>
              </div>
            </div>
          </>
        )}
      </main>
    </PageShell>
  );
}
