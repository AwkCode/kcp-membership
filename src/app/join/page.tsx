// Kings Court Boston - Join Page
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import PageShell from "@/components/PageShell";

export default function JoinPage() {
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
      <PageShell>
        <Header />
        <main className="flex flex-col items-center justify-center px-6 pt-20 pb-24">
          <div className="max-w-md w-full bg-white/[0.06] rounded-2xl border border-white/[0.06] p-10 text-center">
            <Image src="/kc-logo-v3.png" alt="Kings Court" width={80} height={80} className="mx-auto mb-4 rounded" />
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">You&apos;re In!</h1>
            <p className="text-white/50 text-sm">
              Check your email for your membership QR code and digital card link.
            </p>
          </div>
        </main>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <Header />
      <main className="flex flex-col items-center px-6 pt-12 pb-24">
        <div className="max-w-md w-full">
          <div className="bg-white/[0.06] rounded-2xl border border-white/[0.06] p-8">
            <div className="text-center mb-6">
              <Image src="/kc-logo-v3.png" alt="Kings Court" width={64} height={64} className="mx-auto mb-3 rounded" />
              <h1 className="text-2xl font-bold text-white">Join Kings Court</h1>
              <p className="text-white/40 text-sm mt-1">Get instant check-in access</p>
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

              <div>
                <label htmlFor="email" className="block text-xs font-medium text-white/60 mb-1.5">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white/[0.06] border border-white/10 rounded-xl text-white placeholder-white/20 focus:ring-2 focus:ring-white/20 focus:border-transparent text-sm"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-medium text-white/60 mb-1.5">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  minLength={6}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white/[0.06] border border-white/10 rounded-xl text-white placeholder-white/20 focus:ring-2 focus:ring-white/20 focus:border-transparent text-sm"
                  placeholder="Min 6 characters"
                />
              </div>

              <div>
                <label htmlFor="confirm_password" className="block text-xs font-medium text-white/60 mb-1.5">
                  Confirm Password
                </label>
                <input
                  id="confirm_password"
                  type="password"
                  required
                  minLength={6}
                  value={form.confirm_password}
                  onChange={(e) => setForm({ ...form, confirm_password: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white/[0.06] border border-white/10 rounded-xl text-white placeholder-white/20 focus:ring-2 focus:ring-white/20 focus:border-transparent text-sm"
                  placeholder="Re-enter password"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-xs font-medium text-white/60 mb-1.5">
                  Phone <span className="text-white/30">(optional — get a text with your card)</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white/[0.06] border border-white/10 rounded-xl text-white placeholder-white/20 focus:ring-2 focus:ring-white/20 focus:border-transparent text-sm"
                />
              </div>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 rounded border-white/20 bg-white/[0.06] text-white focus:ring-white/20"
                  required
                />
                <span className="text-white/40 text-xs leading-relaxed">
                  I agree to the{" "}
                  <Link href="/terms" target="_blank" className="text-white/60 underline">
                    Terms of Service & Privacy Policy
                  </Link>
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
      </main>
    </PageShell>
  );
}
