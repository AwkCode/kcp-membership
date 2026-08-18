"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { BYLAWS_TEXT } from "@/lib/bylaws";

export default function MembershipForm() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
  });
  const [agreed, setAgreed] = useState(false);
  const [readTerms, setReadTerms] = useState(false);
  const termsRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // If the by-laws fit without scrolling (short viewport/content), unlock immediately.
  useEffect(() => {
    const el = termsRef.current;
    if (el && el.scrollHeight <= el.clientHeight + 4) setReadTerms(true);
  }, []);

  function handleTermsScroll(e: React.UIEvent<HTMLDivElement>) {
    const el = e.currentTarget;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 24) setReadTerms(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    // Either a phone or an email is required — the member picks.
    if (!form.phone.trim() && !form.email.trim()) {
      setErrorMsg("Enter a phone number or an email so we can send your card.");
      setStatus("error");
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch("/api/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: form.first_name,
          last_name: form.last_name,
          phone: form.phone,
          email: form.email,
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

  if (status === "success") {
    return (
      <div className="max-w-md w-full bg-white/[0.04] rounded-2xl border border-kc-purple/15 p-10 text-center">
        <Image src="/kc-logo-v3.png" alt="Kings Court" width={80} height={80} className="mx-auto mb-4 rounded" />
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-kc-purple/10 flex items-center justify-center">
          <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">You&apos;re In!</h1>
        <p className="text-white/50 text-sm">
          Check your phone and/or email for your membership QR code and digital card link.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md w-full">
      <div className="bg-white/[0.04] rounded-2xl border border-kc-purple/10 p-8">
        <div className="text-center mb-6">
          <Image src="/kc-logo-v3.png" alt="Kings Court" width={64} height={64} className="mx-auto mb-3 rounded" />
          <h1 className="text-2xl font-bold text-white">Join Kings Court</h1>
          <p className="text-white/50 text-sm mt-1 font-semibold uppercase tracking-wide">
            A Private Membership Club — Members Only
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="first_name" className="block text-xs font-medium text-white/60 mb-1.5">
                First Name
              </label>
              <input
                id="first_name"
                type="text"
                required
                value={form.first_name}
                onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white/[0.06] border border-white/10 rounded-xl text-white placeholder-white/20 focus:ring-2 focus:ring-white/20 focus:border-transparent text-sm"
              />
            </div>
            <div>
              <label htmlFor="last_name" className="block text-xs font-medium text-white/60 mb-1.5">
                Last Name
              </label>
              <input
                id="last_name"
                type="text"
                required
                value={form.last_name}
                onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white/[0.06] border border-white/10 rounded-xl text-white placeholder-white/20 focus:ring-2 focus:ring-white/20 focus:border-transparent text-sm"
              />
            </div>
          </div>

          <p className="text-white/40 text-xs">
            Add a phone number or an email (or both) — we&apos;ll send your membership card there.
          </p>

          <div>
            <label htmlFor="phone" className="block text-xs font-medium text-white/60 mb-1.5">
              Phone <span className="text-white/30">(we&apos;ll text your card)</span>
            </label>
            <input
              id="phone"
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="(555) 123-4567"
              className="w-full px-3.5 py-2.5 bg-white/[0.06] border border-white/10 rounded-xl text-white placeholder-white/20 focus:ring-2 focus:ring-white/20 focus:border-transparent text-sm"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-xs font-medium text-white/60 mb-1.5">
              Email <span className="text-white/30">(we&apos;ll email your card)</span>
            </label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              className="w-full px-3.5 py-2.5 bg-white/[0.06] border border-white/10 rounded-xl text-white placeholder-white/20 focus:ring-2 focus:ring-white/20 focus:border-transparent text-sm"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-white/60">
                Membership By-Laws — please read
              </label>
              <Link
                href="/terms"
                target="_blank"
                className="text-white/30 text-[11px] underline hover:text-white/60 transition"
              >
                Open full document
              </Link>
            </div>
            <div
              ref={termsRef}
              onScroll={handleTermsScroll}
              className="h-48 overflow-y-auto rounded-xl border border-white/10 bg-black/30 p-3 text-white/50 text-[11px] leading-relaxed whitespace-pre-wrap"
            >
              {BYLAWS_TEXT}
            </div>
            <p className={`text-[11px] mt-1.5 ${readTerms ? "text-green-400/80" : "text-white/40"}`}>
              {readTerms
                ? "✓ You've reached the end of the by-laws — you can accept below."
                : "Scroll to the bottom of the by-laws to continue."}
            </p>
          </div>

          <label
            className={`flex items-start gap-2.5 ${
              readTerms ? "cursor-pointer" : "cursor-not-allowed opacity-50"
            }`}
          >
            <input
              type="checkbox"
              checked={agreed}
              disabled={!readTerms}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 rounded border-white/20 bg-white/[0.06] text-white focus:ring-white/20 disabled:cursor-not-allowed"
              required
            />
            <span className="text-white/80 text-xs font-bold uppercase tracking-wide leading-relaxed">
              I am at least 21 years old, and I understand Kings Court is a private membership club,
              not open to the public. I have read and agree to the{" "}
              <Link href="/terms" target="_blank" className="underline">
                Membership By-Laws & Terms of Service
              </Link>
              .
            </span>
          </label>

          {status === "error" && (
            <p className="text-red-400 text-sm">{errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={status === "loading" || !agreed}
            className="w-full py-3 bg-white text-black rounded-xl font-semibold hover:bg-white/90 transition disabled:opacity-50 text-sm mt-2"
          >
            {status === "loading" ? "Joining..." : "Join Now"}
          </button>
        </form>
      </div>
    </div>
  );
}
