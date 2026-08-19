"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import PageShell from "@/components/PageShell";
import { DoodleScatter } from "@/components/Doodles";

export default function CardRecoveryPage() {
  const [form, setForm] = useState({ phone: "", email: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    if (!form.phone.trim() && !form.email.trim()) {
      setErrorMsg("Enter the phone number or email you signed up with.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: form.phone, email: form.email }),
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
      <PageShell>
        <Header />
        <DoodleScatter variant="join" />
        <main className="flex flex-col items-center justify-center px-6 pt-24 sm:pt-28 pb-24 min-h-screen">
          <div className="max-w-md w-full bg-white/[0.04] rounded-2xl border border-kc-purple/15 p-10 text-center">
            <Image src="/kc-logo-v3.png" alt="Kings Court" width={80} height={80} className="mx-auto mb-4 rounded" />
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-kc-purple/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Card Sent!</h1>
            <p className="text-white/50 text-sm">
              Check your phone and/or email — we&apos;ve re-sent your membership QR code and card link.
            </p>
          </div>
        </main>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <Header />
      <DoodleScatter variant="join" />
      <main className="flex flex-col items-center px-6 pt-24 sm:pt-28 pb-24">
        <div className="max-w-md w-full">
          <div className="bg-white/[0.04] rounded-2xl border border-kc-purple/10 p-8">
            <div className="text-center mb-6">
              <Image src="/kc-logo-v3.png" alt="Kings Court" width={64} height={64} className="mx-auto mb-3 rounded" />
              <h1 className="text-2xl font-bold text-white">Lost Your Card?</h1>
              <p className="text-white/40 text-sm mt-1">
                Enter the phone or email you joined with and we&apos;ll re-send it.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="phone" className="block text-xs font-medium text-white/60 mb-1.5">
                  Phone
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
                  Email
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

              <p className="text-white/40 text-xs">
                Use either one — whichever you signed up with.
              </p>

              {status === "error" && (
                <p className="text-red-400 text-sm">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full py-3 bg-white text-black rounded-xl font-semibold hover:bg-white/90 transition disabled:opacity-50 text-sm mt-2"
              >
                {status === "loading" ? "Sending..." : "Re-send My Card"}
              </button>
            </form>

            <p className="text-center text-white/30 text-xs mt-5">
              Not a member yet?{" "}
              <Link href="/" className="text-white/60 underline hover:text-white transition">
                Join here
              </Link>
            </p>
          </div>
        </div>
      </main>
    </PageShell>
  );
}
