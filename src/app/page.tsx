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

            {/* KC Premium Tier Cards */}
            <div className="w-full max-w-5xl px-4 sm:px-0 mt-16 sm:mt-24">
              <div className="text-center mb-10">
                <div className="flex items-center justify-center gap-4 sm:gap-5 mb-5">
                  <Image src="/kc-logo-v3.png" alt="Kings Court" width={40} height={40} className="rounded-lg w-9 h-9 sm:w-10 sm:h-10" />
                  <span className="text-xl sm:text-2xl font-bold text-kc-purple-light select-none">&times;</span>
                  <Image src="/levia-logo.png" alt="Levia" width={80} height={32} className="object-contain h-9 sm:h-10 w-auto" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">
                  KC Premium Membership
                </h2>
                <p className="text-white/40 text-sm max-w-md mx-auto font-light">
                  Upgrade to Premium for ticket deals, coffee discounts, merch perks, and monthly Levia products.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-4 sm:gap-5">
                {/* Executive */}
                <div className="bg-white/[0.04] rounded-2xl border border-kc-purple/10 p-6 hover:border-kc-purple/20 hover:bg-kc-purple/[0.04] transition">
                  <h3 className="text-teal-300 font-bold text-base mb-1">Executive</h3>
                  <p className="text-white/40 text-xs mb-4">1 Bottle of 500mg Drops</p>
                  <div className="mb-5">
                    <span className="text-3xl font-bold text-white">$40</span>
                    <span className="text-white/30 text-sm">/mo</span>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {["50% Off Coffee", "10% Off Merch", "After Party Access", "Monthly 500mg Drops"].map((perk) => (
                      <li key={perk} className="flex items-center gap-2">
                        <svg className="w-3.5 h-3.5 text-kc-purple-light shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-white/60 text-xs">{perk}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/join/levia?tier=levia-executive"
                    className="block w-full text-center py-3 rounded-xl font-semibold text-sm bg-white/[0.06] border border-white/[0.08] text-white hover:bg-white/[0.1] transition"
                  >
                    Get Executive
                  </Link>
                </div>

                {/* Premium — highlighted */}
                <div className="relative bg-white/[0.04] rounded-2xl border border-kc-purple/25 p-6 hover:border-kc-purple/40 hover:bg-kc-purple/[0.06] transition shadow-lg shadow-kc-purple/5">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-kc-purple rounded-full text-[10px] font-semibold uppercase tracking-wider text-white">
                    Most Popular
                  </div>
                  <h3 className="text-kc-purple-light font-bold text-base mb-1">Premium</h3>
                  <p className="text-white/40 text-xs mb-4">12-Pack</p>
                  <div className="mb-5">
                    <span className="text-3xl font-bold text-white">$70</span>
                    <span className="text-white/30 text-sm">/mo</span>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {["BOHO Tickets (1x/week)", "Free Coffee", "15% Off Merch", "After Party Access", "Monthly 12-Pack"].map((perk) => (
                      <li key={perk} className="flex items-center gap-2">
                        <svg className="w-3.5 h-3.5 text-kc-purple-light shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-white/60 text-xs">{perk}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/join/levia?tier=levia-premium"
                    className="block w-full text-center py-3 rounded-xl font-semibold text-sm bg-kc-purple text-white hover:bg-kc-purple-light transition btn-glow"
                  >
                    Get Premium
                  </Link>
                </div>

                {/* Platinum */}
                <div className="bg-white/[0.04] rounded-2xl border border-kc-purple/10 p-6 hover:border-kc-purple/20 hover:bg-kc-purple/[0.04] transition">
                  <h3 className="text-amber-300 font-bold text-base mb-1">Platinum</h3>
                  <p className="text-white/40 text-xs mb-4">24-Pack</p>
                  <div className="mb-5">
                    <span className="text-3xl font-bold text-white">$120</span>
                    <span className="text-white/30 text-sm">/mo</span>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {["BOGO Tickets (1x/week)", "Free Coffee", "20% Off Merch", "After Party Access", "Monthly 24-Pack"].map((perk) => (
                      <li key={perk} className="flex items-center gap-2">
                        <svg className="w-3.5 h-3.5 text-kc-purple-light shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-white/60 text-xs">{perk}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/join/levia?tier=levia-platinum"
                    className="block w-full text-center py-3 rounded-xl font-semibold text-sm bg-white/[0.06] border border-white/[0.08] text-white hover:bg-white/[0.1] transition"
                  >
                    Get Platinum
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </PageShell>
  );
}
