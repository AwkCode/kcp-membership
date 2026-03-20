// Kings Court Boston × Levia — Premium Membership Portal
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const leviaPerks = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    title: "Founding Member Locker",
    desc: "Personal wine-locker-style storage on the 2nd floor with curated Levia products.",
    delay: 0,
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Monthly Product Allotment",
    desc: "Curated Levia drops — gummies, pre-rolls, drink enhancers, and seasonal exclusives.",
    delay: 1,
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: "Daytime Coworking",
    desc: "Work from the club. Included coworking access with cold juice punch card.",
    delay: 2,
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
      </svg>
    ),
    title: "Dispensary Discounts",
    desc: "Flash your KCB card at 250+ dispensaries for exclusive Levia deals statewide.",
    delay: 3,
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
      </svg>
    ),
    title: "Earn Show Tickets",
    desc: "Convert coworking hours into tickets for live comedy, music, and private events.",
    delay: 4,
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: "Private Club Access",
    desc: "Full access to members-only events, after-hours sessions, and VIP nights.",
    delay: 5,
  },
];

const stats = [
  { value: "250+", label: "Partner Dispensaries" },
  { value: "∞", label: "Levia Water Refills" },
  { value: "24/7", label: "Locker Access" },
  { value: "Free", label: "To Join" },
];

export default function LeviaMembershipPortal() {
  const [scrollY, setScrollY] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#040208] text-white overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="levia-orb levia-orb-1" />
        <div className="levia-orb levia-orb-2" />
        <div className="levia-orb levia-orb-3" />
      </div>

      {/* Subtle grid overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Noise texture overlay */}
      <div className="fixed inset-0 pointer-events-none levia-noise opacity-[0.035]" />

      {/* Smoke particles — full page */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {mounted && Array.from({ length: 80 }).map((_, i) => {
          const size = 1 + Math.random() * 4;
          const isBig = size > 3;
          return (
            <div
              key={i}
              className={isBig ? "levia-smoke" : "levia-particle"}
              style={{
                left: `${Math.random() * 100}%`,
                width: `${size}px`,
                height: `${size}px`,
                animationDelay: `${Math.random() * 15}s`,
                animationDuration: `${6 + Math.random() * 18}s`,
                opacity: 0.15 + Math.random() * 0.5,
              }}
            />
          );
        })}
      </div>

      {/* ─── HERO ─── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6">

        {/* Hero content */}
        <div
          className="relative z-10 text-center max-w-3xl mx-auto"
          style={{
            transform: `translateY(${scrollY * 0.15}px)`,
            opacity: Math.max(0, 1 - scrollY / 600),
          }}
        >
          {/* Logos */}
          <div
            className={`flex items-center justify-center gap-6 sm:gap-8 mb-10 transition-all duration-1000 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <Image
              src="/kc-logo-v3.png"
              alt="Kings Court"
              width={72}
              height={72}
              className="rounded-lg levia-logo-glow w-16 h-16 sm:w-[72px] sm:h-[72px] self-center translate-y-1"
            />
            <span className="text-4xl sm:text-5xl font-bold levia-gradient-text select-none">&times;</span>
            <Image
              src="/levia-logo.png"
              alt="Levia"
              width={140}
              height={56}
              className="object-contain levia-logo-glow h-16 sm:h-[72px] w-auto"
            />
          </div>

          {/* Badge */}
          <div
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-teal-400/20 bg-teal-400/[0.06] mb-8 transition-all duration-1000 delay-200 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
            <span className="text-teal-300/80 text-xs font-medium tracking-wider uppercase">
              Founding Memberships Open
            </span>
          </div>

          {/* Main headline */}
          <h1
            className={`text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6 transition-all duration-1000 delay-300 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <span className="block text-white">Elevate Your</span>
            <span className="block levia-gradient-text">Membership</span>
          </h1>

          {/* Subtitle */}
          <p
            className={`text-lg sm:text-xl text-white/40 max-w-lg mx-auto font-light leading-relaxed mb-10 transition-all duration-1000 delay-500 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Lockers. Product drops. Coworking. Dispensary discounts.
            The premium tier at Boston&apos;s most creative private club.
          </p>

          {/* CTA buttons */}
          <div
            className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-1000 delay-700 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <Link
              href="/join/levia"
              className="group relative px-8 py-4 rounded-full font-semibold text-sm overflow-hidden levia-cta-primary"
            >
              <span className="relative z-10 flex items-center gap-2">
                Become a Member
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </Link>
            <Link
              href="/perks"
              className="px-8 py-4 rounded-full font-semibold text-sm border border-white/10 text-white/60 hover:text-white hover:border-white/25 transition-all duration-300"
            >
              View All Perks
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className={`absolute bottom-10 left-1/2 -translate-x-1/2 transition-all duration-1000 delay-1000 ${
            mounted ? "opacity-100" : "opacity-0"
          }`}
          style={{ opacity: Math.max(0, 1 - scrollY / 200) }}
        >
          <div className="levia-scroll-indicator">
            <div className="levia-scroll-dot" />
          </div>
        </div>
      </section>

      {/* ─── STATS BAR ─── */}
      <section className="relative z-10 py-16 border-y border-white/[0.04]">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl sm:text-4xl font-bold levia-gradient-text mb-1">
                {stat.value}
              </div>
              <div className="text-white/30 text-xs tracking-wider uppercase">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── PERKS GRID ─── */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <p className="text-teal-400/60 text-xs font-medium tracking-[0.2em] uppercase mb-4">
              Exclusive Benefits
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
              More Than a <span className="levia-gradient-text">Membership</span>
            </h2>
            <p className="text-white/35 text-base max-w-md mx-auto font-light">
              Everything in the free tier, plus Levia-powered perks you won&apos;t find anywhere else.
            </p>
          </div>

          {/* Perks */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {leviaPerks.map((perk, i) => (
              <div
                key={i}
                className="group levia-perk-card"
              >
                <div className="levia-perk-icon">
                  {perk.icon}
                </div>
                <h3 className="font-semibold text-white text-[15px] mb-1.5">{perk.title}</h3>
                <p className="text-white/35 text-sm leading-relaxed">{perk.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRODUCT SHOWCASE ─── */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="levia-showcase-card">
            {/* Glow effect behind card */}
            <div className="absolute -inset-px rounded-[28px] bg-gradient-to-b from-teal-400/20 via-transparent to-purple-500/20 blur-sm" />

            <div className="relative rounded-[28px] bg-[#0a0a14]/90 border border-white/[0.06] backdrop-blur-xl overflow-hidden">
              {/* Inner gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/[0.04] via-transparent to-purple-500/[0.04]" />

              <div className="relative flex flex-col md:flex-row items-center gap-10 p-10 md:p-14">
                {/* Left side — text */}
                <div className="flex-1 text-center md:text-left">
                  <p className="text-teal-400/60 text-xs font-medium tracking-[0.2em] uppercase mb-3">
                    Monthly Drop
                  </p>
                  <h3 className="text-2xl sm:text-3xl font-bold mb-3 tracking-tight">
                    Your Locker,<br />
                    <span className="levia-gradient-text">Restocked Monthly</span>
                  </h3>
                  <p className="text-white/35 text-sm leading-relaxed mb-6 max-w-sm">
                    Every month your founding member locker gets restocked with curated Levia products — gummies, seltzers, drink drops, pre-rolls, and seasonal specials.
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    {["Gummies", "Seltzers", "Drink Drops", "Pre-Rolls"].map((item) => (
                      <span
                        key={item}
                        className="px-3 py-1 text-xs rounded-full border border-teal-400/15 bg-teal-400/[0.06] text-teal-300/70"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right side — visual element */}
                <div className="relative w-48 h-48 md:w-56 md:h-56 shrink-0">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-teal-500/20 to-purple-600/20 blur-xl" />
                  <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-teal-500/10 to-purple-500/10 border border-white/[0.06] flex items-center justify-center overflow-hidden">
                    <Image
                      src="/levia-logo.png"
                      alt="Levia Products"
                      width={120}
                      height={48}
                      className="object-contain opacity-60"
                    />
                    {/* Animated shimmer */}
                    <div className="absolute inset-0 levia-shimmer" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── BOTTOM CTA ─── */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-2xl mx-auto text-center">
          {/* Decorative lines */}
          <div className="flex items-center justify-center gap-4 mb-10">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-teal-400/30" />
            <div className="w-2 h-2 rounded-full bg-teal-400/40" />
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-teal-400/30" />
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-5">
            Ready to <span className="levia-gradient-text">Elevate</span>?
          </h2>
          <p className="text-white/35 text-base mb-10 max-w-md mx-auto font-light">
            Join the founding members. Lock in your locker. Get your monthly drops. It&apos;s free to join.
          </p>

          <Link
            href="/join/levia"
            className="group inline-flex items-center gap-3 levia-cta-primary px-10 py-5 rounded-full font-semibold text-base"
          >
            <span className="relative z-10">Claim Your Membership</span>
            <svg
              className="relative z-10 w-5 h-5 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>

          <p className="text-white/20 text-xs mt-6">
            Already a member?{" "}
            <Link href="/members/login" className="text-teal-400/50 hover:text-teal-400/70 transition underline">
              Sign in
            </Link>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.04] py-8 px-6">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image src="/kc-logo-v3.png" alt="Kings Court" width={24} height={24} className="rounded opacity-40" />
            <span className="text-white/20 text-xs">Kings Court Boston</span>
          </div>
          <div className="flex items-center gap-6 text-white/20 text-xs">
            <Link href="/perks" className="hover:text-white/40 transition">Perks</Link>
            <Link href="/join" className="hover:text-white/40 transition">Free Membership</Link>
            <Link href="/terms" className="hover:text-white/40 transition">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
