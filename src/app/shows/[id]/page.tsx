"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import ComedianHeader from "@/components/ComedianHeader";
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
  eventbrite_url: string;
}

interface MyRequest {
  id: string;
  status: string;
  message: string;
  requested_set_length: number | null;
  created_at: string;
}

interface LineupEntry {
  slot_order: number;
  set_length_minutes: number;
  role: string;
  comedians: {
    display_name: string;
  };
}

export default function ShowDetailPage() {
  const params = useParams();
  const showId = params.id as string;

  const [show, setShow] = useState<Show | null>(null);
  const [myRequest, setMyRequest] = useState<MyRequest | null>(null);
  const [lineup, setLineup] = useState<LineupEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [setLength, setSetLength] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const [showRes, requestsRes, lineupRes] = await Promise.all([
        fetch(`/api/shows?upcoming=false`),
        fetch(`/api/requests?show_id=${showId}&my=true`),
        fetch(`/api/lineup?show_id=${showId}`),
      ]);

      if (showRes.ok) {
        const showData = await showRes.json();
        const found = showData.shows.find((s: Show) => s.id === showId);
        setShow(found || null);
      }

      if (requestsRes.ok) {
        const reqData = await requestsRes.json();
        if (reqData.requests && reqData.requests.length > 0) {
          setMyRequest(reqData.requests[0]);
        }
      }

      if (lineupRes.ok) {
        const lineupData = await lineupRes.json();
        setLineup(lineupData.lineup || []);
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

  async function requestSpot() {
    setSubmitting(true);
    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          show_id: showId,
          requested_set_length: setLength ? parseInt(setLength) : null,
          message: message.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to submit request");
        setSubmitting(false);
        return;
      }

      fetchData();
    } catch {
      alert("Failed to submit request");
    } finally {
      setSubmitting(false);
    }
  }

  async function cancelRequest() {
    if (!myRequest || !confirm("Cancel your spot request?")) return;
    try {
      const res = await fetch(`/api/requests/${myRequest.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "canceled" }),
      });
      if (!res.ok) throw new Error();
      fetchData();
    } catch {
      alert("Failed to cancel request");
    }
  }

  function formatDate(dateStr: string) {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
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

  return (
    <PageShell>
      <ComedianHeader />
      <div className="max-w-2xl mx-auto p-4 sm:p-6">
        {loading ? (
          <p className="text-white/30 text-center py-8 text-sm">Loading...</p>
        ) : !show ? (
          <p className="text-white/30 text-center py-8 text-sm">Show not found</p>
        ) : (
          <>
            {/* Show Info */}
            <div className="bg-white/[0.06] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-6 mb-4">
              <h1 className="text-xl font-bold text-white mb-1">{show.show_name}</h1>
              <p className="text-white/50 text-sm">{formatDate(show.show_date)} at {formatTime(show.start_time)}</p>
              <p className="text-white/30 text-xs mt-1">{show.venue}</p>
              {show.eventbrite_url && (
                <a
                  href={show.eventbrite_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-lg text-xs font-medium hover:bg-orange-500/20 transition"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  View on Eventbrite
                </a>
              )}
              {show.notes && <p className="text-white/40 text-sm mt-3">{show.notes}</p>}
              <div className="mt-3">
                <span className="text-white/30 text-xs">{show.capacity_slots} spots total</span>
                <span className="text-white/20 text-xs mx-2">|</span>
                <span className="text-white/30 text-xs">{lineup.length} confirmed</span>
              </div>
            </div>

            {/* My Request Status or Request Form */}
            {myRequest && myRequest.status !== "canceled" ? (
              <div className="bg-white/[0.06] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-6 mb-4">
                <h2 className="text-sm font-medium text-white mb-3">Your Request</h2>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium border ${requestStatusColors[myRequest.status]}`}>
                    {myRequest.status}
                  </span>
                  <span className="text-white/20 text-xs">
                    Submitted {new Date(myRequest.created_at).toLocaleDateString()}
                  </span>
                </div>
                {myRequest.message && (
                  <p className="text-white/40 text-xs mt-2">Your message: {myRequest.message}</p>
                )}
                {myRequest.status === "approved" && (
                  <p className="text-green-400 text-sm mt-3 font-medium">You&apos;re on the lineup!</p>
                )}
                {(myRequest.status === "requested" || myRequest.status === "waitlisted") && (
                  <button
                    onClick={cancelRequest}
                    className="mt-3 text-red-400 text-xs hover:text-red-300"
                  >
                    Cancel Request
                  </button>
                )}
              </div>
            ) : show.status !== "canceled" && show.status !== "closed" ? (
              <div className="bg-white/[0.06] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-6 mb-4">
                <h2 className="text-sm font-medium text-white mb-3">Request a Spot</h2>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-1.5">
                      Preferred Set Length <span className="text-white/30">(optional, minutes)</span>
                    </label>
                    <input
                      type="number"
                      value={setLength}
                      onChange={(e) => setSetLength(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white/[0.06] border border-white/10 rounded-xl text-white text-sm"
                      placeholder="10"
                      min={1}
                      max={30}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-1.5">
                      Note to Booker <span className="text-white/30">(optional)</span>
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white/[0.06] border border-white/10 rounded-xl text-white text-sm"
                      rows={2}
                      placeholder="Anything you want us to know..."
                    />
                  </div>

                  <button
                    onClick={requestSpot}
                    disabled={submitting}
                    className="w-full py-3 bg-white text-black rounded-xl font-semibold hover:bg-white/90 transition disabled:opacity-50 text-sm"
                  >
                    {submitting ? "Submitting..." : "Request Spot"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white/[0.06] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-6 mb-4 text-center">
                <p className="text-white/40 text-sm">
                  {show.status === "canceled" ? "This show has been canceled." : "This show is no longer accepting requests."}
                </p>
              </div>
            )}

            {/* Confirmed Lineup */}
            {lineup.length > 0 && (
              <div className="bg-white/[0.06] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-6">
                <h2 className="text-sm font-medium text-white mb-3">Lineup</h2>
                <div className="space-y-2">
                  {lineup.map((entry, i) => (
                    <div key={i} className="flex items-center gap-3 py-2 border-b border-white/[0.04] last:border-0">
                      <span className="text-white/20 text-xs w-6 text-center">{entry.slot_order}</span>
                      <div className="flex-1">
                        <span className="text-white text-sm">{entry.comedians.display_name}</span>
                        {entry.role !== "performer" && (
                          <span className="ml-2 text-[10px] px-1.5 py-0.5 bg-white/10 text-white/50 rounded-full">{entry.role}</span>
                        )}
                      </div>
                      <span className="text-white/30 text-xs">{entry.set_length_minutes} min</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </PageShell>
  );
}
