"use client";

import { useState } from "react";
import StaffHeader from "@/components/StaffHeader";
import PageShell from "@/components/PageShell";

interface MemberResult {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  status: string;
  last_checkin: string | null;
}

export default function DoorPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MemberResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [checkedInId, setCheckedInId] = useState<string | null>(null);
  const [checkingInId, setCheckingInId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function handleSearch(q: string) {
    setQuery(q);
    setError("");
    if (q.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/members/search?q=${encodeURIComponent(q)}`);
      if (!res.ok) throw new Error("Search failed");
      const data = await res.json();
      setResults(data.members);
    } catch {
      setError("Search failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleCheckin(memberId: string) {
    setCheckingInId(memberId);
    setError("");
    try {
      const res = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ member_id: memberId }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }
      setCheckedInId(memberId);
      setTimeout(() => setCheckedInId(null), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Check-in failed");
    } finally {
      setCheckingInId(null);
    }
  }

  return (
    <PageShell>
      <StaffHeader />
      <div className="max-w-lg mx-auto p-4">
        <input
          type="text"
          placeholder="Search by name, email, or phone..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full px-4 py-3 bg-white/[0.06] border border-white/10 rounded-xl text-white placeholder-white/30 focus:ring-2 focus:ring-white/20 focus:border-transparent text-base"
          autoFocus
        />

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mt-4 text-sm">
            {error}
          </div>
        )}

        {loading && <p className="text-white/30 text-center mt-4 text-sm">Searching...</p>}

        <div className="mt-4 space-y-2">
          {results.map((m) => (
            <div
              key={m.id}
              className="bg-white/[0.04] border border-kc-purple/10 rounded-xl p-4 flex items-center justify-between"
            >
              <div>
                <p className="font-medium text-white text-sm">
                  {m.first_name} {m.last_name}
                </p>
                <p className="text-white/30 text-xs">{m.email}</p>
                <span
                  className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                    ["active", "vip", "staff", "comp"].includes(m.status)
                      ? m.status === "vip" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        : m.status === "staff" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                        : m.status === "comp" ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                        : "bg-green-500/10 text-green-400 border border-green-500/20"
                      : "bg-red-500/10 text-red-400 border border-red-500/20"
                  }`}
                >
                  {m.status}
                </span>
              </div>
              <div>
                {checkedInId === m.id ? (
                  <span className="text-green-400 font-medium text-sm">Done!</span>
                ) : (
                  <button
                    onClick={() => handleCheckin(m.id)}
                    disabled={checkingInId === m.id || !["active", "vip", "staff", "comp"].includes(m.status)}
                    className="px-4 py-2 bg-white text-black rounded-lg text-sm font-medium hover:bg-white/90 disabled:opacity-40 transition"
                  >
                    {checkingInId === m.id ? "..." : "Check In"}
                  </button>
                )}
              </div>
            </div>
          ))}
          {query.length >= 2 && !loading && results.length === 0 && (
            <p className="text-white/30 text-center py-8 text-sm">No members found</p>
          )}
        </div>
      </div>
    </PageShell>
  );
}
