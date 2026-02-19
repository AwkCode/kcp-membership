"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
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
}

interface BookingRequest {
  id: string;
  status: string;
  message: string;
  requested_set_length: number | null;
  created_at: string;
  comedians: {
    id: string;
    display_name: string;
    email: string;
    instagram: string | null;
    city: string | null;
    state: string | null;
    status: string;
  };
}

interface LineupEntry {
  id: string;
  slot_order: number;
  set_length_minutes: number;
  role: string;
  internal_notes: string;
  comedians: {
    id: string;
    display_name: string;
    email: string;
    instagram: string | null;
    city: string | null;
    state: string | null;
  };
}

export default function AdminShowDetailPage() {
  const params = useParams();
  const showId = params.id as string;

  const [show, setShow] = useState<Show | null>(null);
  const [requests, setRequests] = useState<BookingRequest[]>([]);
  const [lineup, setLineup] = useState<LineupEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"requests" | "lineup">("requests");

  const fetchData = useCallback(async () => {
    try {
      const [showRes, requestsRes, lineupRes] = await Promise.all([
        fetch("/api/shows"),
        fetch(`/api/requests?show_id=${showId}`),
        fetch(`/api/lineup?show_id=${showId}`),
      ]);

      if (showRes.ok) {
        const data = await showRes.json();
        setShow(data.shows.find((s: Show) => s.id === showId) || null);
      }
      if (requestsRes.ok) {
        const data = await requestsRes.json();
        setRequests(data.requests);
      }
      if (lineupRes.ok) {
        const data = await lineupRes.json();
        setLineup(data.lineup);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [showId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function updateRequestStatus(requestId: string, status: string) {
    try {
      const res = await fetch(`/api/requests/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      fetchData();
    } catch {
      alert("Failed to update request");
    }
  }

  async function moveLineupItem(entryId: string, direction: "up" | "down") {
    const idx = lineup.findIndex((e) => e.id === entryId);
    if (idx === -1) return;
    if (direction === "up" && idx === 0) return;
    if (direction === "down" && idx === lineup.length - 1) return;

    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    const updatedLineup = [...lineup];
    [updatedLineup[idx], updatedLineup[swapIdx]] = [updatedLineup[swapIdx], updatedLineup[idx]];

    // Renumber
    const updates = updatedLineup.map((entry, i) => ({
      id: entry.id,
      slot_order: i + 1,
    }));

    setLineup(updatedLineup.map((entry, i) => ({ ...entry, slot_order: i + 1 })));

    try {
      await fetch("/api/lineup", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lineup: updates }),
      });
    } catch {
      fetchData(); // revert on error
    }
  }

  async function updateLineupEntry(entryId: string, updates: Partial<LineupEntry>) {
    try {
      await fetch("/api/lineup", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lineup: [{ id: entryId, ...updates }] }),
      });
      fetchData();
    } catch {
      alert("Failed to update");
    }
  }

  async function removeFromLineup(entryId: string) {
    if (!confirm("Remove from lineup?")) return;
    try {
      await fetch(`/api/lineup?id=${entryId}`, { method: "DELETE" });
      fetchData();
    } catch {
      alert("Failed to remove");
    }
  }

  function formatDate(dateStr: string) {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  }

  function formatTime(timeStr: string) {
    const [h, m] = timeStr.split(":");
    const hour = parseInt(h);
    const ampm = hour >= 12 ? "PM" : "AM";
    const h12 = hour % 12 || 12;
    return `${h12}:${m} ${ampm}`;
  }

  const requestStatusColors: Record<string, string> = {
    requested: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    waitlisted: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    approved: "bg-green-500/10 text-green-400 border-green-500/20",
    rejected: "bg-red-500/10 text-red-400 border-red-500/20",
    canceled: "bg-white/10 text-white/40 border-white/10",
  };

  const pendingRequests = requests.filter((r) => r.status === "requested" || r.status === "waitlisted");
  const resolvedRequests = requests.filter((r) => r.status !== "requested" && r.status !== "waitlisted");

  return (
    <PageShell>
      <StaffHeader />
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        {loading ? (
          <p className="text-white/30 text-center py-8 text-sm">Loading...</p>
        ) : !show ? (
          <p className="text-white/30 text-center py-8 text-sm">Show not found</p>
        ) : (
          <>
            {/* Show Header */}
            <div className="bg-white/[0.06] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-6 mb-4">
              <h1 className="text-xl font-bold text-white">{show.show_name}</h1>
              <p className="text-white/50 text-sm mt-1">
                {formatDate(show.show_date)} at {formatTime(show.start_time)} | {show.venue}
              </p>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-white/30 text-xs">{lineup.length}/{show.capacity_slots} spots filled</span>
                <span className="text-white/20">|</span>
                <span className="text-blue-400 text-xs">{pendingRequests.length} pending request{pendingRequests.length !== 1 ? "s" : ""}</span>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-4">
              <button
                onClick={() => setTab("requests")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  tab === "requests" ? "bg-white/10 text-white" : "text-white/40 hover:text-white/60"
                }`}
              >
                Requests {pendingRequests.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 bg-blue-500/20 text-blue-400 rounded-full text-[10px]">
                    {pendingRequests.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setTab("lineup")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  tab === "lineup" ? "bg-white/10 text-white" : "text-white/40 hover:text-white/60"
                }`}
              >
                Lineup ({lineup.length})
              </button>
            </div>

            {/* Requests Tab */}
            {tab === "requests" && (
              <div className="space-y-2">
                {pendingRequests.length > 0 && (
                  <>
                    <h3 className="text-white/40 text-xs uppercase tracking-wide mb-2">Pending</h3>
                    {pendingRequests.map((req) => (
                      <div key={req.id} className="bg-white/[0.06] backdrop-blur-xl border border-white/[0.06] rounded-xl p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-white text-sm">{req.comedians.display_name}</p>
                            <p className="text-white/30 text-xs mt-0.5">
                              {req.comedians.email}
                              {req.comedians.instagram && ` | ${req.comedians.instagram}`}
                              {req.comedians.city && ` | ${req.comedians.city}, ${req.comedians.state}`}
                            </p>
                            {req.message && (
                              <p className="text-white/50 text-xs mt-2 italic">&ldquo;{req.message}&rdquo;</p>
                            )}
                            {req.requested_set_length && (
                              <p className="text-white/30 text-xs mt-1">Requested: {req.requested_set_length} min</p>
                            )}
                          </div>
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium border ${requestStatusColors[req.status]}`}>
                            {req.status}
                          </span>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => updateRequestStatus(req.id, "approved")}
                            className="px-3 py-1.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-lg text-xs font-medium hover:bg-green-500/20 transition"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => updateRequestStatus(req.id, "waitlisted")}
                            className="px-3 py-1.5 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-lg text-xs font-medium hover:bg-yellow-500/20 transition"
                          >
                            Waitlist
                          </button>
                          <button
                            onClick={() => updateRequestStatus(req.id, "rejected")}
                            className="px-3 py-1.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg text-xs font-medium hover:bg-red-500/20 transition"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </>
                )}
                {pendingRequests.length === 0 && (
                  <p className="text-white/30 text-center py-6 text-sm">No pending requests</p>
                )}
                {resolvedRequests.length > 0 && (
                  <>
                    <h3 className="text-white/40 text-xs uppercase tracking-wide mb-2 mt-6">Resolved</h3>
                    {resolvedRequests.map((req) => (
                      <div key={req.id} className="bg-white/[0.04] backdrop-blur-xl border border-white/[0.04] rounded-xl p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-white/50 text-sm">{req.comedians.display_name}</span>
                            <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium border ${requestStatusColors[req.status]}`}>
                              {req.status}
                            </span>
                          </div>
                          {req.status === "rejected" && (
                            <button
                              onClick={() => updateRequestStatus(req.id, "approved")}
                              className="text-green-400/60 text-xs hover:text-green-400"
                            >
                              Approve
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}

            {/* Lineup Tab */}
            {tab === "lineup" && (
              <div className="space-y-2">
                {lineup.length === 0 ? (
                  <p className="text-white/30 text-center py-6 text-sm">
                    No one on the lineup yet. Approve requests to add comics.
                  </p>
                ) : (
                  lineup.map((entry, idx) => (
                    <div key={entry.id} className="bg-white/[0.06] backdrop-blur-xl border border-white/[0.06] rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        {/* Reorder buttons */}
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => moveLineupItem(entry.id, "up")}
                            disabled={idx === 0}
                            className="text-white/20 hover:text-white/60 disabled:opacity-20 text-xs"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                          </button>
                          <button
                            onClick={() => moveLineupItem(entry.id, "down")}
                            disabled={idx === lineup.length - 1}
                            className="text-white/20 hover:text-white/60 disabled:opacity-20 text-xs"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        </div>

                        {/* Slot number */}
                        <span className="text-white/20 text-sm font-mono w-6 text-center">{entry.slot_order}</span>

                        {/* Comedian info */}
                        <div className="flex-1">
                          <p className="text-white text-sm font-medium">{entry.comedians.display_name}</p>
                          <p className="text-white/30 text-xs">
                            {entry.comedians.email}
                            {entry.comedians.instagram && ` | ${entry.comedians.instagram}`}
                          </p>
                        </div>

                        {/* Role select */}
                        <select
                          value={entry.role}
                          onChange={(e) => updateLineupEntry(entry.id, { role: e.target.value } as Partial<LineupEntry>)}
                          className="px-2 py-1 bg-white/[0.06] border border-white/10 rounded-lg text-white text-xs"
                        >
                          <option value="performer">Performer</option>
                          <option value="host">Host</option>
                          <option value="feature">Feature</option>
                          <option value="headliner">Headliner</option>
                          <option value="guest">Guest</option>
                        </select>

                        {/* Set length */}
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={entry.set_length_minutes}
                            onChange={(e) => updateLineupEntry(entry.id, { set_length_minutes: parseInt(e.target.value) || 10 } as Partial<LineupEntry>)}
                            className="w-12 px-2 py-1 bg-white/[0.06] border border-white/10 rounded-lg text-white text-xs text-center"
                            min={1}
                            max={60}
                          />
                          <span className="text-white/30 text-xs">min</span>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => removeFromLineup(entry.id)}
                          className="text-red-400/40 hover:text-red-400 transition"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>
    </PageShell>
  );
}
