"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
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
  show_lineup: { count: number }[];
  booking_requests: { count: number }[];
}

export default function ShowsPage() {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchShows = useCallback(async () => {
    try {
      const res = await fetch("/api/shows?upcoming=true");
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

  return (
    <PageShell>
      <ComedianHeader />
      <div className="max-w-2xl mx-auto p-4 sm:p-6">
        <h1 className="text-xl font-bold text-white mb-6">Upcoming Shows</h1>

        {loading ? (
          <p className="text-white/30 text-center py-8 text-sm">Loading...</p>
        ) : shows.length === 0 ? (
          <div className="bg-white/[0.06] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-8 text-center">
            <p className="text-white/40 text-sm">No upcoming shows right now.</p>
            <p className="text-white/20 text-xs mt-1">Check back soon!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {shows.map((show) => {
              const lineupCount = show.show_lineup?.[0]?.count || 0;
              const spotsLeft = show.capacity_slots - lineupCount;
              const isClosed = show.status === "closed";

              return (
                <Link key={show.id} href={`/shows/${show.id}`}>
                  <div className="bg-white/[0.06] backdrop-blur-xl border border-white/[0.06] rounded-xl p-4 hover:bg-white/[0.1] transition cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-white text-sm">{show.show_name}</h3>
                        <p className="text-white/50 text-xs mt-1">
                          {formatDate(show.show_date)} at {formatTime(show.start_time)}
                        </p>
                        <p className="text-white/30 text-xs mt-0.5">{show.venue}</p>
                      </div>
                      <div className="text-right">
                        {isClosed ? (
                          <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                            Closed
                          </span>
                        ) : spotsLeft <= 0 ? (
                          <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                            Waitlist
                          </span>
                        ) : (
                          <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                            {spotsLeft} spot{spotsLeft !== 1 ? "s" : ""} left
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </PageShell>
  );
}
