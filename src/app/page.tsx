"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import PageShell from "@/components/PageShell";
import { DoodleScatter } from "@/components/Doodles";
import { createSupabaseBrowser } from "@/lib/supabase/client";

interface UserInfo {
  displayName: string;
  isArtist: boolean;
  isStaff: boolean;
  isMember: boolean;
}

export default function Home() {
  const router = useRouter();
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

        // Check user metadata for role — staff gets redirected immediately
        const role = authUser.user_metadata?.role;
        if (role === "staff" || role === "admin") {
          router.replace("/admin/dashboard");
          return;
        }

        // Check if they have an artist profile
        const { data: artist } = await supabase
          .from("comedians")
          .select("display_name")
          .eq("auth_id", authUser.id)
          .single();

        // Check if they have a member profile
        const { data: member } = await supabase
          .from("members")
          .select("first_name")
          .eq("auth_id", authUser.id)
          .single();

        setUser({
          displayName: member?.first_name || artist?.display_name || authUser.email?.split("@")[0] || "there",
          isArtist: !!artist,
          isStaff: false,
          isMember: !!member,
        });
      } catch {
        // not logged in, that's fine
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, [router]);

  return (
    <PageShell>
      <Header />
      <DoodleScatter variant="home" />
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
              {user.isArtist && (
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

              {user.isMember && (
                <Link
                  href="/members/account"
                  className="px-8 py-3.5 bg-white text-black rounded-lg font-semibold hover:bg-white/90 transition text-center shadow-lg text-sm btn-glow"
                >
                  My Card
                </Link>
              )}

              {!user.isArtist && !user.isStaff && !user.isMember && (
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
              {!user.isArtist && (
                <Link href="/artists/join" className="text-white/30 text-xs hover:text-white/60 transition">
                  Artist Sign Up
                </Link>
              )}
              {user.isArtist && !user.isMember && (
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
              Boston&apos;s underground home for live comedy, music, and creative culture.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto px-4 sm:px-0">
              <Link
                href="/join"
                className="px-8 py-3.5 bg-white text-black rounded-lg font-semibold hover:bg-white/90 transition text-center shadow-lg text-sm btn-glow"
              >
                Become a Free Member
              </Link>
            </div>
          </>
        )}
      </main>
    </PageShell>
  );
}
