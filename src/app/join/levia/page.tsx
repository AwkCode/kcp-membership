// Kings Court Boston × Levia — Membership Signup
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const leviaHighlights = [
  { icon: "🔒", title: "Founding Locker", desc: "Personal storage on the 2nd floor" },
  { icon: "📦", title: "Monthly Drops", desc: "Curated Levia products every month" },
  { icon: "💻", title: "Coworking", desc: "Daytime workspace access included" },
  { icon: "🏷️", title: "Dispensary Deals", desc: "Discounts at 250+ locations" },
];

export default function LeviaJoinPage() {
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
    phone: "",
  });
  const [agreed, setAgreed] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => setMounted(true), []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    if (form.password !== form.confirm_password) {
      setErrorMsg("Passwords don't match");
      setStatus("error");
      return;
    }

    if (form.password.length < 6) {
      setErrorMsg("Password must be at least 6 characters");
      setStatus("error");
      return;
    }

    try {
      const res = await fetch("/api/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: form.first_name,
          last_name: form.last_name,
          email: form.email,
          password: form.password,
          phone: form.phone,
          tier: "levia",
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      setStatus("success");
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
    }
  }

  const inputClass =
    "w-full px-4 py-3 bg-white/[0.04] border border-white/[0.06] rounded-xl text-white placeholder-white/20 text-sm transition-all duration-300 focus:outline-none focus:border-teal-400/30 focus:bg-white/[0.06] focus:shadow-[0_0_0_2px_rgba(20,184,166,0.1),0_0_20px_rgba(20,184,166,0.05)]";

  if (status === "success") {
    return (
      <div className="min-h-screen bg-[#040208] text-white overflow-hidden">
        {/* Animated gradient orbs */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="levia-orb levia-orb-1" />
          <div className="levia-orb levia-orb-2" />
        </div>
        <div className="fixed inset-0 pointer-events-none levia-noise opacity-[0.035]" />

        <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
          <div
            className={`max-w-md w-full text-center transition-all duration-1000 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            {/* Glow border card */}
            <div className="relative">
              <div className="absolute -inset-px rounded-[28px] bg-gradient-to-b from-teal-400/20 via-transparent to-purple-500/20 blur-sm" />
              <div className="relative rounded-[28px] bg-[#0a0a14]/90 border border-white/[0.06] backdrop-blur-xl p-10">
                <div className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-teal-500/[0.03] via-transparent to-purple-500/[0.03]" />

                <div className="relative">
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <Image src="/kc-logo-v3.png" alt="Kings Court" width={48} height={48} className="rounded-lg levia-logo-glow w-11 h-11 translate-y-1.5" />
                    <span className="text-2xl font-bold levia-gradient-text select-none">&times;</span>
                    <Image src="/levia-logo.png" alt="Levia" width={90} height={36} className="object-contain levia-logo-glow h-11 w-auto" />
                  </div>

                  <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-teal-500/10 border border-teal-400/20 flex items-center justify-center">
                    <svg className="w-8 h-8 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>

                  <h1 className="text-2xl font-bold mb-2">
                    You&apos;re a <span className="levia-gradient-text">Levia Member</span>!
                  </h1>
                  <p className="text-white/40 text-sm leading-relaxed">
                    Check your email for your membership QR code, digital card link, and Levia perks info.
                  </p>
                  <p className="text-white/25 text-xs mt-5">
                    Access your card anytime by{" "}
                    <Link href="/members/login" className="text-teal-400/60 hover:text-teal-400/80 transition underline">
                      logging in
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#040208] text-white overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="levia-orb levia-orb-1" />
        <div className="levia-orb levia-orb-2" />
        <div className="levia-orb levia-orb-3" />
      </div>

      {/* Grid + noise overlays */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div className="fixed inset-0 pointer-events-none levia-noise opacity-[0.035]" />

      {/* Smoke particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {mounted && Array.from({ length: 120 }).map((_, i) => {
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

      <main className="relative z-10 flex flex-col items-center px-6 pt-10 pb-24 min-h-screen">
        {/* Back to portal link */}
        <div
          className={`w-full max-w-lg mb-6 transition-all duration-700 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <Link href="/levia" className="inline-flex items-center gap-2 text-white/30 hover:text-white/50 transition text-xs">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Levia
          </Link>
        </div>

        <div className="max-w-lg w-full">
          {/* Logos + headline */}
          <div
            className={`text-center mb-8 transition-all duration-1000 delay-100 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <div className="flex items-center justify-center gap-5 sm:gap-6 mb-5">
              <Image src="/kc-logo-v3.png" alt="Kings Court" width={56} height={56} className="rounded-lg levia-logo-glow w-12 h-12 sm:w-14 sm:h-14 translate-y-2" />
              <span className="text-3xl sm:text-4xl font-bold levia-gradient-text select-none">&times;</span>
              <Image src="/levia-logo.png" alt="Levia" width={110} height={44} className="object-contain levia-logo-glow h-12 sm:h-14 w-auto" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
              Become a <span className="levia-gradient-text">Member</span>
            </h1>
            <p className="text-white/35 text-sm">Lock in your founding membership. It&apos;s free.</p>
          </div>

          {/* Perks preview strip */}
          <div
            className={`grid grid-cols-2 sm:grid-cols-4 gap-2 mb-8 transition-all duration-1000 delay-300 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {leviaHighlights.map((perk, i) => (
              <div
                key={i}
                className="text-center py-3 px-2 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-teal-400/10 transition"
              >
                <div className="text-lg mb-1">{perk.icon}</div>
                <p className="text-white/70 text-[11px] font-medium">{perk.title}</p>
                <p className="text-white/25 text-[10px] leading-snug mt-0.5">{perk.desc}</p>
              </div>
            ))}
          </div>

          {/* Form card */}
          <div
            className={`relative transition-all duration-1000 delay-500 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            {/* Glow border */}
            <div className="absolute -inset-px rounded-[24px] bg-gradient-to-b from-teal-400/15 via-transparent to-purple-500/15 blur-sm" />

            <div className="relative rounded-[24px] bg-[#0a0a14]/80 border border-white/[0.06] backdrop-blur-xl p-8 sm:p-10">
              {/* Inner gradient */}
              <div className="absolute inset-0 rounded-[24px] bg-gradient-to-br from-teal-500/[0.02] via-transparent to-purple-500/[0.02]" />

              <form onSubmit={handleSubmit} className="relative space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="first_name" className="block text-xs font-medium text-white/50 mb-2">
                      First Name
                    </label>
                    <input
                      id="first_name"
                      type="text"
                      required
                      value={form.first_name}
                      onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="last_name" className="block text-xs font-medium text-white/50 mb-2">
                      Last Name
                    </label>
                    <input
                      id="last_name"
                      type="text"
                      required
                      value={form.last_name}
                      onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-medium text-white/50 mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="password" className="block text-xs font-medium text-white/50 mb-2">
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      required
                      minLength={6}
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className={inputClass}
                      placeholder="Min 6 characters"
                    />
                  </div>
                  <div>
                    <label htmlFor="confirm_password" className="block text-xs font-medium text-white/50 mb-2">
                      Confirm
                    </label>
                    <input
                      id="confirm_password"
                      type="password"
                      required
                      minLength={6}
                      value={form.confirm_password}
                      onChange={(e) => setForm({ ...form, confirm_password: e.target.value })}
                      className={inputClass}
                      placeholder="Re-enter"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-xs font-medium text-white/50 mb-2">
                    Phone <span className="text-white/20">(optional — get a text with your card)</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className={inputClass}
                  />
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3 py-1">
                  <div className="flex-1 h-px bg-white/[0.04]" />
                  <div className="w-1 h-1 rounded-full bg-teal-400/20" />
                  <div className="flex-1 h-px bg-white/[0.04]" />
                </div>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-0.5 rounded border-white/20 bg-white/[0.06] text-teal-500 focus:ring-teal-500/20"
                    required
                  />
                  <span className="text-white/35 text-xs leading-relaxed">
                    I am at least 21 years old and agree to the{" "}
                    <Link href="/terms" target="_blank" className="text-white/55 hover:text-white/70 transition underline">
                      Membership By-Laws & Terms of Service
                    </Link>
                  </span>
                </label>

                {status === "error" && (
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/[0.08] border border-red-500/15">
                    <svg className="w-4 h-4 text-red-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-red-300 text-sm">{errorMsg}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === "loading" || !agreed}
                  className="w-full py-3.5 rounded-xl font-semibold text-sm levia-cta-primary disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {status === "loading" ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Joining...
                    </span>
                  ) : (
                    "Join as Levia Member"
                  )}
                </button>
              </form>

              <p className="relative text-center mt-5 text-white/25 text-xs">
                Looking for the free membership?{" "}
                <Link href="/join" className="text-white/45 hover:text-white/60 transition underline">
                  Join here
                </Link>
              </p>
            </div>
          </div>

          {/* View all perks link */}
          <div
            className={`text-center mt-6 transition-all duration-1000 delay-700 ${
              mounted ? "opacity-100" : "opacity-0"
            }`}
          >
            <Link href="/levia" className="text-teal-400/40 hover:text-teal-400/60 transition text-xs">
              View all Levia perks →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
