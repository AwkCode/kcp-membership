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
  show_lineup: { count: number }[];
  booking_requests: { count: number }[];
}

interface Member {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  status: string;
  created_at: string;
}

interface BookingRequest {
  id: string;
  status: string;
  created_at: string;
  comedians: {
    id: string;
    display_name: string;
  };
  shows: {
    id: string;
    show_name: string;
    show_date: string;
    start_time: string;
  };
}

const memberStatusColors: Record<string, string> = {
  active: "bg-green-500/10 text-green-400 border-green-500/20",
  vip: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  staff: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  comp: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  expired: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  suspended: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
};

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

function timeAgo(dateStr: string) {
  const now = new Date();
  const then = new Date(dateStr);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateStr.split("T")[0]);
}

export default function DashboardPage() {
  const [shows, setShows] = useState<Show[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [requests, setRequests] = useState<BookingRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = useCallback(async () => {
    try {
      const [showsRes, requestsRes, membersRes] = await Promise.all([
        fetch("/api/shows?upcoming=true"),
        fetch("/api/requests"),
        fetch("/api/members"),
      ]);

      if (showsRes.ok) {
        const data = await showsRes.json();
        setShows(data.shows || []);
      }
      if (requestsRes.ok) {
        const data = await requestsRes.json();
        setRequests(data.requests || []);
      }
      if (membersRes.ok) {
        const data = await membersRes.json();
        setMembers(data.members || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const today = new Date().toISOString().split("T")[0];
  const todayFormatted = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const tonightShows = shows.filter((s) => s.show_date === today);
  const featuredShows = tonightShows.length > 0 ? tonightShows : shows.slice(0, 2);
  const isTonight = tonightShows.length > 0;

  const pendingRequests = requests.filter((r) => r.status === "requested");
  const recentMembers = members.slice(0, 5);

  return (
    <PageShell>
      <StaffHeader />
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        {loading ? (
          <p className="text-white/30 text-center py-8 text-sm">Loading...</p>
        ) : (
          <>
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-xl font-bold text-white">Dashboard</h1>
              <p className="text-white/40 text-sm mt-1">{todayFormatted}</p>
            </div>

            {/* Tonight / Next Up */}
            <div className="mb-6">
              <h2 className="text-white/40 text-xs uppercase tracking-wide mb-3">
                {isTonight ? "Tonight" : "Next Up"}
              </h2>
              {featuredShows.length > 0 ? (
                <div className="space-y-2">
                  {featuredShows.map((show) => {
                    const lineupCount = show.show_lineup?.[0]?.count || 0;
                    const showPending = pendingRequests.filter(
                      (r) => r.shows?.id === show.id
                    ).length;

                    return (
                      <Link href={`/admin/shows/${show.id}`} key={show.id}>
                        <div className="bg-white/[0.04] border border-kc-purple/10 rounded-2xl p-5 hover:bg-white/[0.05] transition">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-semibold text-white">{show.show_name}</p>
                              <p className="text-white/50 text-xs mt-1">
                                {formatDate(show.show_date)} at {formatTime(show.start_time)}
                              </p>
                              <div className="flex items-center gap-3 mt-2">
                                <span className="text-white/30 text-xs">
                                  {lineupCount}/{show.capacity_slots} spots
                                </span>
                                {showPending > 0 && (
                                  <span className="text-blue-400 text-xs">
                                    {showPending} pending
                                  </span>
                                )}
                              </div>
                            </div>
                            <span className="text-white/30 text-xs mt-1">Manage →</span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <p className="text-white/30 text-sm">No upcoming shows</p>
              )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <Link href="/admin">
                <div className="bg-white/[0.04] border border-kc-purple/10 rounded-xl p-4 text-center hover:bg-white/[0.05] transition">
                  <p className="text-2xl font-bold text-white">{members.length}</p>
                  <p className="text-white/40 text-xs mt-1">Members</p>
                </div>
              </Link>
              <Link href="/admin/shows">
                <div className="bg-white/[0.04] border border-kc-purple/10 rounded-xl p-4 text-center hover:bg-white/[0.05] transition">
                  <p className="text-2xl font-bold text-white">{shows.length}</p>
                  <p className="text-white/40 text-xs mt-1">Upcoming</p>
                </div>
              </Link>
              <div className="bg-white/[0.04] border border-kc-purple/10 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-white">{pendingRequests.length}</p>
                <p className="text-white/40 text-xs mt-1">Pending</p>
              </div>
            </div>

            {/* Pending Requests */}
            {pendingRequests.length > 0 && (
              <div className="mb-6">
                <h2 className="text-white/40 text-xs uppercase tracking-wide mb-3">
                  Pending Requests
                </h2>
                <div className="space-y-1.5">
                  {pendingRequests.slice(0, 5).map((req) => (
                    <Link href={`/admin/shows/${req.shows?.id}`} key={req.id}>
                      <div className="bg-white/[0.04] border border-kc-purple/10 rounded-xl p-3 hover:bg-white/[0.05] transition">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white text-sm">{req.comedians?.display_name}</p>
                            <p className="text-white/30 text-xs">{req.shows?.show_name}</p>
                          </div>
                          <span className="text-blue-400 text-xs">{timeAgo(req.created_at)}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Signups */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-white/40 text-xs uppercase tracking-wide">
                  Recent Signups
                </h2>
                <Link href="/admin" className="text-white/30 text-xs hover:text-white/60 transition">
                  View all
                </Link>
              </div>
              {recentMembers.length > 0 ? (
                <div className="space-y-1.5">
                  {recentMembers.map((m) => (
                    <div
                      key={m.id}
                      className="bg-white/[0.04] border border-kc-purple/10 rounded-xl p-3"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white text-sm">
                            {m.first_name} {m.last_name}
                          </p>
                          <p className="text-white/30 text-xs">{m.email}</p>
                        </div>
                        <div className="text-right">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                              memberStatusColors[m.status] || "bg-gray-500/10 text-gray-400 border-gray-500/20"
                            }`}
                          >
                            {m.status}
                          </span>
                          <p className="text-white/20 text-xs mt-0.5">
                            {timeAgo(m.created_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-white/30 text-sm">No members yet</p>
              )}
            </div>
          </>
        )}
      </div>
    </PageShell>
  );
}
