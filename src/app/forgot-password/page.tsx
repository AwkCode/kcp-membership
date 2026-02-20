"use client";

import { useState } from "react";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import Image from "next/image";
import Link from "next/link";
import PageShell from "@/components/PageShell";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createSupabaseBrowser();
    const baseUrl = window.location.origin;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${baseUrl}/auth/callback?next=/reset-password`,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  }

  return (
    <PageShell>
      <main className="min-h-screen flex flex-col items-center justify-center px-6">
        <div className="max-w-sm w-full bg-white/[0.06] backdrop-blur-xl rounded-2xl border border-white/[0.06] p-8">
          <div className="text-center mb-6">
            <Image src="/kc-logo-v3.png" alt="Kings Court" width={80} height={80} className="mx-auto mb-3 rounded" />
            <h1 className="text-xl font-bold text-white">Reset Password</h1>
            <p className="text-white/40 text-sm">
              {sent ? "Check your email" : "Enter your email to get a reset link"}
            </p>
          </div>

          {sent ? (
            <div className="text-center space-y-4">
              <p className="text-white/60 text-sm">
                If an account exists for <strong className="text-white">{email}</strong>, you&apos;ll receive a password reset link shortly.
              </p>
              <Link
                href="/login"
                className="inline-block text-white/60 text-xs underline"
              >
                Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-xs font-medium text-white/60 mb-1.5">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white/[0.06] border border-white/10 rounded-xl text-white placeholder-white/20 focus:ring-2 focus:ring-white/20 focus:border-transparent text-sm"
                />
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-white text-black rounded-xl font-semibold hover:bg-white/90 transition disabled:opacity-50 text-sm"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>

              <p className="text-white/30 text-xs text-center">
                <Link href="/login" className="text-white/60 underline">
                  Back to Login
                </Link>
              </p>
            </form>
          )}
        </div>
      </main>
    </PageShell>
  );
}
