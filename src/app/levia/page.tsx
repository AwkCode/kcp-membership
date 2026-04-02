// KC Premium Member × Levia — 3-Tier Membership Portal
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const tiers = [
  {
    name: "Executive",
    slug: "levia-executive",
    product: "1 Bottle of 500mg Drops",
    price: "$40",
    period: "/mo",
    perks: [
      { title: "50% Off Coffee", desc: "Half off at the Kings Court coffee shop" },
      { title: "10% Off Merch", desc: "Discount on all KCB merchandise" },
      { title: "After Party Access", desc: "Free entry to The After Party" },
      { title: "Monthly 500mg Drops", desc: "1 bottle of Levia drops every month" },
    ],
    highlight: false,
    color: "teal",
  },
  {
    name: "Premium",
    slug: "levia-premium",
    product: "12-Pack",
    price: "$70",
    period: "/mo",
    perks: [
      { title: "BOHO Tickets", desc: "Buy one, get one half off — once per week" },
      { title: "50% Off Coffee", desc: "Half off at the Kings Court coffee shop" },
      { title: "15% Off Merch", desc: "Discount on all KCB merchandise" },
      { title: "After Party Access", desc: "Free entry to The After Party" },
      { title: "Monthly 12-Pack", desc: "Levia 12-pack delivered every month" },
    ],
    highlight: true,
    color: "purple",
  },
  {
    name: "Platinum",
    slug: "levia-platinum",
    product: "24-Pack",
    price: "$120",
    period: "/mo",
    perks: [
      { title: "BOGO Tickets", desc: "Buy one, get one free — once per week" },
      { title: "50% Off Coffee", desc: "Half off at the Kings Court coffee shop" },
      { title: "20% Off Merch", desc: "Discount on all KCB merchandise" },
      { title: "After Party Access", desc: "Free entry to The After Party" },
      { title: "Monthly 24-Pack", desc: "Levia 24-pack delivered every month" },
    ],
    highlight: false,
    color: "gold",
  },
];

const stats = [
  { value: "3", label: "Membership Tiers" },
  { value: "BOGO", label: "Show Tickets" },
  { value: "Live", label: "Comedy & Music" },
  { value: "420", label: "Friendly Always" },
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

      {/* Smoke particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {mounted && Array.from({ length: 160 }).map((_, i) => {
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
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center px-6">
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
              className="rounded-lg levia-logo-glow w-16 h-16 sm:w-[72px] sm:h-[72px] self-center translate-y-2.5"
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

          {/* Main headline */}
          <h1
            className={`text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6 transition-all duration-1000 delay-300 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <span className="block text-white">Choose Your</span>
            <span className="block levia-gradient-text">Experience</span>
          </h1>

          {/* Subtitle */}
          <p
            className={`text-lg sm:text-xl text-white/40 max-w-lg mx-auto font-light leading-relaxed mb-10 transition-all duration-1000 delay-500 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            KC Premium membership powered by Levia. Pick the tier that fits your vibe.
          </p>

          {/* CTA */}
          <div
            className={`transition-all duration-1000 delay-700 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <a
              href="#tiers"
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-sm border border-white/10 text-white/60 hover:text-white hover:border-white/25 transition-all duration-300"
            >
              View Membership Tiers
              <svg className="w-4 h-4 transition-transform group-hover:translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </a>
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

      {/* Stats bar removed — info covered in tier cards + comparison table */}

      {/* ─── TIER COMPARISON ─── */}
      <section id="tiers" className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <p className="text-teal-400/60 text-xs font-medium tracking-[0.2em] uppercase mb-4">
              Membership Tiers
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Pick Your <span className="levia-gradient-text">Tier</span>
            </h2>
            <p className="text-white/35 text-base max-w-md mx-auto font-light">
              BOGO tickets, 50% off coffee, After Party access, and monthly Levia products.
            </p>
          </div>

          {/* Tier Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {tiers.map((tier) => (
              <div
                key={tier.slug}
                className={`relative rounded-[24px] overflow-hidden transition-all duration-500 hover:-translate-y-1 ${
                  tier.highlight
                    ? "levia-tier-card-highlight"
                    : "levia-tier-card"
                }`}
              >
                {/* Popular badge */}
                {tier.highlight && (
                  <div className="absolute top-0 left-0 right-0 text-center py-2 bg-gradient-to-r from-teal-500/20 via-purple-500/20 to-teal-500/20 border-b border-white/[0.06]">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.15em] levia-gradient-text">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className={`p-8 ${tier.highlight ? "pt-12" : ""}`}>
                  {/* Tier name */}
                  <h3 className={`text-lg font-bold mb-1 ${
                    tier.color === "gold" ? "text-amber-300" :
                    tier.color === "purple" ? "levia-gradient-text" :
                    "text-teal-300"
                  }`}>
                    {tier.name}
                  </h3>

                  {/* Product */}
                  <p className="text-white/40 text-sm mb-6">{tier.product}</p>

                  {/* Price */}
                  <div className="mb-8">
                    <span className="text-4xl font-bold text-white">{tier.price}</span>
                    <span className="text-white/30 text-sm">{tier.period}</span>
                  </div>

                  {/* CTA */}
                  <Link
                    href={`/join/levia?tier=${tier.slug}`}
                    className={`block w-full text-center py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                      tier.highlight
                        ? "levia-cta-primary"
                        : "bg-white/[0.06] border border-white/[0.08] text-white hover:bg-white/[0.1] hover:border-white/[0.15]"
                    }`}
                  >
                    Get {tier.name}
                  </Link>

                  {/* Divider */}
                  <div className="flex items-center gap-3 my-6">
                    <div className="flex-1 h-px bg-white/[0.06]" />
                    <span className="text-white/20 text-[10px] uppercase tracking-wider">Includes</span>
                    <div className="flex-1 h-px bg-white/[0.06]" />
                  </div>

                  {/* Perks list */}
                  <ul className="space-y-3">
                    {tier.perks.map((perk, pi) => (
                      <li key={pi} className="flex items-start gap-3">
                        <div className="mt-0.5 w-5 h-5 rounded-full bg-teal-500/15 flex items-center justify-center shrink-0">
                          <svg className="w-3 h-3 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-white/80 text-sm font-medium">{perk.title}</p>
                          <p className="text-white/30 text-xs mt-0.5">{perk.desc}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SIDE-BY-SIDE COMPARISON TABLE ─── */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
              Compare <span className="levia-gradient-text">Tiers</span>
            </h2>
          </div>

          <div className="relative rounded-[24px] bg-white/[0.02] border border-white/[0.06] overflow-hidden">
            {/* Header row */}
            <div className="grid grid-cols-4 border-b border-white/[0.06]">
              <div className="p-4 sm:p-6" />
              {tiers.map((tier) => (
                <div key={tier.slug} className={`p-4 sm:p-6 text-center ${tier.highlight ? "bg-white/[0.02]" : ""}`}>
                  <p className={`font-bold text-sm sm:text-base ${
                    tier.color === "gold" ? "text-amber-300" :
                    tier.color === "purple" ? "levia-gradient-text" :
                    "text-teal-300"
                  }`}>
                    {tier.name}
                  </p>
                  <p className="text-white/40 text-xs mt-0.5">{tier.price}{tier.period}</p>
                </div>
              ))}
            </div>

            {/* Ticket Perk row */}
            <div className="grid grid-cols-4 border-b border-white/[0.04]">
              <div className="p-4 sm:p-6 text-white/50 text-sm">Ticket Perk</div>
              <div className="p-4 sm:p-6 text-center text-white/30 text-sm">—</div>
              <div className="p-4 sm:p-6 text-center text-white/70 text-sm bg-white/[0.02]">BOHO</div>
              <div className="p-4 sm:p-6 text-center text-white/70 text-sm">BOGO</div>
            </div>

            {/* 50% Off Coffee row */}
            <div className="grid grid-cols-4 border-b border-white/[0.04]">
              <div className="p-4 sm:p-6 text-white/50 text-sm">50% Off Coffee</div>
              {[0, 1, 2].map((i) => (
                <div key={i} className={`p-4 sm:p-6 text-center ${i === 1 ? "bg-white/[0.02]" : ""}`}>
                  <svg className="w-5 h-5 text-teal-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              ))}
            </div>

            {/* Merch Discount row */}
            <div className="grid grid-cols-4 border-b border-white/[0.04]">
              <div className="p-4 sm:p-6 text-white/50 text-sm">Merch Discount</div>
              <div className="p-4 sm:p-6 text-center text-white/70 text-sm">10% Off</div>
              <div className="p-4 sm:p-6 text-center text-white/70 text-sm bg-white/[0.02]">15% Off</div>
              <div className="p-4 sm:p-6 text-center text-white/70 text-sm">20% Off</div>
            </div>

            {/* After Party row */}
            <div className="grid grid-cols-4 border-b border-white/[0.04]">
              <div className="p-4 sm:p-6 text-white/50 text-sm">After Party Access</div>
              {[0, 1, 2].map((i) => (
                <div key={i} className={`p-4 sm:p-6 text-center ${i === 1 ? "bg-white/[0.02]" : ""}`}>
                  <svg className="w-5 h-5 text-teal-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              ))}
            </div>

            {/* Levia Product row */}
            <div className="grid grid-cols-4">
              <div className="p-4 sm:p-6 text-white/50 text-sm">Levia Product</div>
              <div className="p-4 sm:p-6 text-center text-white/70 text-sm">500mg Drops</div>
              <div className="p-4 sm:p-6 text-center text-white/70 text-sm bg-white/[0.02]">12-Pack</div>
              <div className="p-4 sm:p-6 text-center text-white/70 text-sm">24-Pack</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── BOTTOM CTA ─── */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex items-center justify-center gap-4 mb-10">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-teal-400/30" />
            <div className="w-2 h-2 rounded-full bg-teal-400/40" />
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-teal-400/30" />
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-5">
            Ready to <span className="levia-gradient-text">Elevate</span>?
          </h2>
          <p className="text-white/35 text-base mb-10 max-w-md mx-auto font-light">
            Pick your tier and start getting Levia products and KCB show perks every month.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#tiers"
              className="group inline-flex items-center gap-3 levia-cta-primary px-10 py-5 rounded-full font-semibold text-base"
            >
              <span className="relative z-10">Choose Your Tier</span>
              <svg
                className="relative z-10 w-5 h-5 transition-transform group-hover:translate-y-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </a>
          </div>

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
