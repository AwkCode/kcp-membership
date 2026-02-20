"use client";

import { useEffect, useState, useCallback } from "react";
import ComedianHeader from "@/components/ComedianHeader";
import PageShell from "@/components/PageShell";

interface BookingRequest {
  id: string;
  status: string;
  message: string;
  requested_set_length: number | null;
  created_at: string;
  shows: {
    id: string;
    show_name: string;
    show_date: string;
    start_time: string;
    status: string;
  };
}

export default function ComedianBookingsPage() {
  const [requests, setRequests] = useState<BookingRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = useCallback(async () => {
    try {
      const res = await fetch("/api/requests?my=true");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setRequests(data.requests);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  async function cancelRequest(id: string) {
    if (!confirm("Cancel this spot request?")) return;
    try {
      const res = await fetch(`/api/requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "canceled" }),
      });
      if (!res.ok) throw new Error();
      fetchBookings();
    } catch {
      alert("Failed to cancel");
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
    requested: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    waitlisted: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    approved: "bg-green-500/10 text-green-400 border-green-500/20",
    rejected: "bg-red-500/10 text-red-400 border-red-500/20",
    canceled: "bg-white/10 text-white/40 border-white/10",
  };

  return (
    <PageShell>
      <ComedianHeader />
      <div className="max-w-2xl mx-auto p-4 sm:p-6">
        <h1 className="text-xl font-bold text-white mb-6">My Spot Requests</h1>

        {loading ? (
          <p className="text-white/30 text-center py-8 text-sm">Loading...</p>
        ) : requests.length === 0 ? (
          <div className="bg-white/[0.06] border border-white/[0.06] rounded-2xl p-8 text-center">
            <p className="text-white/40 text-sm">No spot requests yet.</p>
            <p className="text-white/20 text-xs mt-1">Browse upcoming shows to request a spot.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {requests.map((req) => (
              <div key={req.id} className="bg-white/[0.06] border border-white/[0.06] rounded-xl p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-white text-sm">{req.shows.show_name}</h3>
                    <p className="text-white/50 text-xs mt-1">
                      {formatDate(req.shows.show_date)} at {formatTime(req.shows.start_time)}
                    </p>
                  </div>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium border ${statusColors[req.status]}`}>
                    {req.status}
                  </span>
                </div>
                {req.message && (
                  <p className="text-white/30 text-xs mt-2">Your note: {req.message}</p>
                )}
                <div className="flex items-center justify-between mt-3">
                  <span className="text-white/20 text-xs">
                    Requested {new Date(req.created_at).toLocaleDateString()}
                  </span>
                  {(req.status === "requested" || req.status === "waitlisted") && (
                    <button
                      onClick={() => cancelRequest(req.id)}
                      className="text-red-400 text-xs hover:text-red-300"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
