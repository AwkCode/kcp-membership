"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import StaffHeader from "@/components/StaffHeader";
import PageShell from "@/components/PageShell";

interface Show {
  id: string;
  show_name: string;
  show_date: string;
  start_time: string;
  venue: string;
  capacity_slots: number;
  status: string;
  notes: string;
  show_lineup: { count: number }[];
  booking_requests: { count: number }[];
}

export default function AdminShowsPage() {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    show_name: "",
    show_date: "",
    start_time: "",
    venue: "Kings Court Boston",
    capacity_slots: "8",
    notes: "",
  });

  const fetchShows = useCallback(async () => {
    try {
      const res = await fetch("/api/shows");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setShows(data.shows);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchShows();
  }, [fetchShows]);

  async function createShow(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/shows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          capacity_slots: parseInt(form.capacity_slots),
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }
      setCreating(false);
      setForm({ show_name: "", show_date: "", start_time: "", venue: "Kings Court Boston", capacity_slots: "8", notes: "" });
      fetchShows();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to create show");
    } finally {
      setSaving(false);
    }
  }

  async function updateShowStatus(id: string, status: string) {
    try {
      const res = await fetch("/api/shows", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error();
      fetchShows();
    } catch {
      alert("Failed to update");
    }
  }

  function formatDate(dateStr: string) {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  }

  function formatTime(timeStr: string) {
    const [h, m] = timeStr.split(":");
    const hour = parseInt(h);
    const ampm = hour >= 12 ? "PM" : "AM";
    const h12 = hour % 12 || 12;
    return `${h12}:${m} ${ampm}`;
  }

  const statusColors: Record<string, string> = {
    scheduled: "bg-green-500/10 text-green-400 border-green-500/20",
    closed: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    canceled: "bg-red-500/10 text-red-400 border-red-500/20",
  };

  return (
    <PageShell>
      <StaffHeader />
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-white">Shows</h1>
          <button
            onClick={() => setCreating(!creating)}
            className="px-4 py-2 bg-white text-black rounded-xl text-sm font-semibold hover:bg-white/90 transition"
          >
            {creating ? "Cancel" : "+ New Show"}
          </button>
        </div>

        {creating && (
          <form onSubmit={createShow} className="bg-white/[0.06] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-6 mb-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-white/60 mb-1.5">Show Name *</label>
                <input
                  type="text"
                  required
                  value={form.show_name}
                  onChange={(e) => setForm({ ...form, show_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white/[0.06] border border-white/10 rounded-xl text-white text-sm"
                  placeholder="e.g. Friday 10pm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/60 mb-1.5">Venue</label>
                <input
                  type="text"
                  value={form.venue}
                  onChange={(e) => setForm({ ...form, venue: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white/[0.06] border border-white/10 rounded-xl text-white text-sm"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-white/60 mb-1.5">Date *</label>
                <input
                  type="date"
                  required
                  value={form.show_date}
                  onChange={(e) => setForm({ ...form, show_date: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white/[0.06] border border-white/10 rounded-xl text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/60 mb-1.5">Start Time *</label>
                <input
                  type="time"
                  required
                  value={form.start_time}
                  onChange={(e) => setForm({ ...form, start_time: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white/[0.06] border border-white/10 rounded-xl text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/60 mb-1.5">Spots</label>
                <input
                  type="number"
                  value={form.capacity_slots}
                  onChange={(e) => setForm({ ...form, capacity_slots: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white/[0.06] border border-white/10 rounded-xl text-white text-sm"
                  min={1}
                  max={20}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-white/60 mb-1.5">Notes</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white/[0.06] border border-white/10 rounded-xl text-white text-sm"
                rows={2}
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-white text-black rounded-xl font-semibold text-sm disabled:opacity-50"
            >
              {saving ? "Creating..." : "Create Show"}
            </button>
          </form>
        )}

        {loading ? (
          <p className="text-white/30 text-center py-8 text-sm">Loading...</p>
        ) : shows.length === 0 ? (
          <p className="text-white/30 text-center py-8 text-sm">No shows yet. Create one above!</p>
        ) : (
          <div className="space-y-2">
            {shows.map((show) => {
              const requestCount = show.booking_requests?.[0]?.count || 0;
              const lineupCount = show.show_lineup?.[0]?.count || 0;

              return (
                <div key={show.id} className="bg-white/[0.06] backdrop-blur-xl border border-white/[0.06] rounded-xl p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <Link href={`/admin/shows/${show.id}`} className="font-medium text-white text-sm hover:text-white/80 transition">
                        {show.show_name}
                      </Link>
                      <p className="text-white/50 text-xs mt-1">
                        {formatDate(show.show_date)} at {formatTime(show.start_time)}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium border ${statusColors[show.status]}`}>
                          {show.status}
                        </span>
                        <span className="text-white/30 text-xs">{lineupCount}/{show.capacity_slots} spots filled</span>
                        {requestCount > 0 && (
                          <span className="text-blue-400 text-xs">{requestCount} request{requestCount !== 1 ? "s" : ""}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/shows/${show.id}`}
                        className="px-3 py-1.5 border border-white/10 rounded-lg text-xs text-white/60 hover:text-white hover:border-white/20 transition"
                      >
                        Manage
                      </Link>
                      {show.status === "scheduled" && (
                        <button
                          onClick={() => updateShowStatus(show.id, "closed")}
                          className="px-3 py-1.5 border border-white/10 rounded-lg text-xs text-yellow-400/60 hover:text-yellow-400 transition"
                        >
                          Close
                        </button>
                      )}
                      {show.status === "closed" && (
                        <button
                          onClick={() => updateShowStatus(show.id, "scheduled")}
                          className="px-3 py-1.5 border border-white/10 rounded-lg text-xs text-green-400/60 hover:text-green-400 transition"
                        >
                          Reopen
                        </button>
                      )}
                      {show.status !== "canceled" && (
                        <button
                          onClick={() => {
                            if (confirm("Cancel this show?")) updateShowStatus(show.id, "canceled");
                          }}
                          className="px-3 py-1.5 border border-white/10 rounded-lg text-xs text-red-400/60 hover:text-red-400 transition"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </PageShell>
  );
}
