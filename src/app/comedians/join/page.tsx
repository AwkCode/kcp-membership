"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import PageShell from "@/components/PageShell";

export default function ComedianJoinPage() {
  const [form, setForm] = useState({
    display_name: "",
    email: "",
    password: "",
    phone: "",
    city: "",
    state: "",
    bio: "",
    instagram: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [existingAccount, setExistingAccount] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/comedians/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      const data = await res.json();
      setExistingAccount(data.existingAccount || false);
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
        <main className="flex flex-col items-center justify-center px-6 pt-20 pb-24 min-h-screen">
          <div className="max-w-md w-full bg-white/[0.06] backdrop-blur-xl rounded-2xl border border-white/[0.06] p-10 text-center">
            <Image src="/kc-logo-v3.png" alt="Kings Court" width={80} height={80} className="mx-auto mb-4 rounded" />
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Account Created!</h1>
            <p className="text-white/50 text-sm mb-6">
              {existingAccount
                ? "Your comedian profile has been created and linked to your existing account. Log in with your existing password."
                : "Your profile is pending approval. We'll review it shortly. Once approved, you can browse shows and request spots."}
            </p>
            <Link
              href="/comedians/login"
              className="inline-block px-6 py-3 bg-white text-black rounded-xl font-semibold hover:bg-white/90 transition text-sm"
            >
              Go to Login
            </Link>
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
          <div className="bg-white/[0.06] backdrop-blur-xl rounded-2xl border border-white/[0.06] p-8">
            <div className="text-center mb-6">
              <Image src="/kc-logo-v3.png" alt="Kings Court" width={64} height={64} className="mx-auto mb-3 rounded" />
              <h1 className="text-2xl font-bold text-white">Comedian Sign Up</h1>
              <p className="text-white/40 text-sm mt-1">Create your profile to request spots</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-white/60 mb-1.5">Stage Name / Display Name *</label>
                <input
                  type="text"
                  required
                  value={form.display_name}
                  onChange={(e) => setForm({ ...form, display_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white/[0.06] border border-white/10 rounded-xl text-white placeholder-white/20 focus:ring-2 focus:ring-white/20 focus:border-transparent text-sm"
                  placeholder="Your name as it appears on shows"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/60 mb-1.5">Email *</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white/[0.06] border border-white/10 rounded-xl text-white placeholder-white/20 focus:ring-2 focus:ring-white/20 focus:border-transparent text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/60 mb-1.5">Password *</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white/[0.06] border border-white/10 rounded-xl text-white placeholder-white/20 focus:ring-2 focus:ring-white/20 focus:border-transparent text-sm"
                  placeholder="Min 6 characters"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1.5">City</label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white/[0.06] border border-white/10 rounded-xl text-white placeholder-white/20 focus:ring-2 focus:ring-white/20 focus:border-transparent text-sm"
                    placeholder="Boston"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1.5">State</label>
                  <input
                    type="text"
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white/[0.06] border border-white/10 rounded-xl text-white placeholder-white/20 focus:ring-2 focus:ring-white/20 focus:border-transparent text-sm"
                    placeholder="MA"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/60 mb-1.5">Phone <span className="text-white/30">(optional)</span></label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white/[0.06] border border-white/10 rounded-xl text-white placeholder-white/20 focus:ring-2 focus:ring-white/20 focus:border-transparent text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/60 mb-1.5">Instagram <span className="text-white/30">(optional)</span></label>
                <input
                  type="text"
                  value={form.instagram}
                  onChange={(e) => setForm({ ...form, instagram: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white/[0.06] border border-white/10 rounded-xl text-white placeholder-white/20 focus:ring-2 focus:ring-white/20 focus:border-transparent text-sm"
                  placeholder="@handle"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/60 mb-1.5">Bio <span className="text-white/30">(optional)</span></label>
                <textarea
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white/[0.06] border border-white/10 rounded-xl text-white placeholder-white/20 focus:ring-2 focus:ring-white/20 focus:border-transparent text-sm"
                  rows={3}
                  placeholder="Quick intro about your comedy style..."
                />
              </div>

              {status === "error" && (
                <p className="text-red-400 text-sm">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full py-3 bg-white text-black rounded-xl font-semibold hover:bg-white/90 transition disabled:opacity-50 text-sm mt-2"
              >
                {status === "loading" ? "Creating Account..." : "Create Account"}
              </button>

              <p className="text-white/30 text-xs text-center">
                Already have an account?{" "}
                <Link href="/comedians/login" className="text-white/60 underline">
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </main>
    </PageShell>
  );
}
