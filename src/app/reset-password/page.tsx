"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import Image from "next/image";
import PageShell from "@/components/PageShell";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirm) {
      setError("Passwords don't match");
      return;
    }

    setLoading(true);

    const supabase = createSupabaseBrowser();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
    setTimeout(() => {
      router.push("/");
    }, 2000);
  }

  return (
    <PageShell>
      <main className="min-h-screen flex flex-col items-center justify-center px-6">
        <div className="max-w-sm w-full bg-white/[0.04] rounded-2xl border border-kc-purple/10 p-8">
          <div className="text-center mb-6">
            <Image src="/kc-logo-v3.png" alt="Kings Court" width={80} height={80} className="mx-auto mb-3 rounded" />
            <h1 className="text-xl font-bold text-white">New Password</h1>
            <p className="text-white/40 text-sm">
              {success ? "Password updated!" : "Choose a new password"}
            </p>
          </div>

          {success ? (
            <p className="text-green-400 text-sm text-center">
              Redirecting you now...
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-xs font-medium text-white/60 mb-1.5">
                  New Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white/[0.06] border border-white/10 rounded-xl text-white placeholder-white/20 focus:ring-2 focus:ring-white/20 focus:border-transparent text-sm"
                />
              </div>

              <div>
                <label htmlFor="confirm" className="block text-xs font-medium text-white/60 mb-1.5">
                  Confirm Password
                </label>
                <input
                  id="confirm"
                  type="password"
                  required
                  minLength={6}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white/[0.06] border border-white/10 rounded-xl text-white placeholder-white/20 focus:ring-2 focus:ring-white/20 focus:border-transparent text-sm"
                />
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-white text-black rounded-xl font-semibold hover:bg-white/90 transition disabled:opacity-50 text-sm"
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </form>
          )}
        </div>
      </main>
    </PageShell>
  );
}
