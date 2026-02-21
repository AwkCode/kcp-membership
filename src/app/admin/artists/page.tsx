"use client";

import { useEffect, useState, useCallback } from "react";
import StaffHeader from "@/components/StaffHeader";
import PageShell from "@/components/PageShell";
import { createSupabaseBrowser } from "@/lib/supabase/client";

interface Artist {
  id: string;
  display_name: string;
  legal_name: string | null;
  email: string;
  phone: string | null;
  city: string | null;
  state: string | null;
  bio: string;
  instagram: string | null;
  video_links: string[];
  status: string;
  created_at: string;
}

export default function AdminArtistsPage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchArtists = useCallback(async () => {
    try {
      const supabase = createSupabaseBrowser();
      const { data, error } = await supabase
        .from("comedians")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setArtists(data || []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArtists();
  }, [fetchArtists]);

  async function updateStatus(id: string, status: string) {
    try {
      const supabase = createSupabaseBrowser();
      const { error } = await supabase
        .from("comedians")
        .update({ status })
        .eq("id", id);

      if (error) throw error;
      fetchArtists();
    } catch {
      alert("Failed to update");
    }
  }

  const filtered = artists.filter((c) => {
    const matchesSearch = !filter ||
      c.display_name.toLowerCase().includes(filter.toLowerCase()) ||
      c.email.toLowerCase().includes(filter.toLowerCase());
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    approved: "bg-green-500/10 text-green-400 border-green-500/20",
    banned: "bg-red-500/10 text-red-400 border-red-500/20",
  };

  const pendingCount = artists.filter((c) => c.status === "pending").length;

  return (
    <PageShell>
      <StaffHeader />
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-white">
            Artists
            {pendingCount > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-full text-xs font-medium">
                {pendingCount} pending
              </span>
            )}
          </h1>
        </div>

        <div className="flex gap-3 mb-4">
          <input
            type="text"
            placeholder="Search artists..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="flex-1 px-4 py-2.5 bg-white/[0.06] border border-white/10 rounded-xl text-white placeholder-white/30 focus:ring-2 focus:ring-white/20 focus:border-transparent text-sm"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 bg-white/[0.06] border border-white/10 rounded-xl text-white text-sm"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="banned">Banned</option>
          </select>
        </div>

        {loading ? (
          <p className="text-white/30 text-center py-8 text-sm">Loading...</p>
        ) : (
          <div className="space-y-2">
            {filtered.map((c) => (
              <div key={c.id} className="bg-white/[0.04] border border-kc-purple/10 rounded-xl p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-white text-sm">{c.display_name}</p>
                    <p className="text-white/30 text-xs mt-0.5">
                      {c.email}
                      {c.instagram && ` | ${c.instagram}`}
                      {c.city && ` | ${c.city}, ${c.state}`}
                    </p>
                    {c.bio && (
                      <p className="text-white/40 text-xs mt-2 line-clamp-2">{c.bio}</p>
                    )}
                    {c.video_links && c.video_links.length > 0 && (
                      <div className="mt-2">
                        {c.video_links.map((link, i) => (
                          <a key={i} href={link} target="_blank" rel="noopener noreferrer"
                            className="text-blue-400 text-xs underline mr-3 hover:text-blue-300">
                            Video {i + 1}
                          </a>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium border ${statusColors[c.status]}`}>
                        {c.status}
                      </span>
                      <span className="text-white/20 text-xs">
                        Joined {new Date(c.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {c.status === "pending" && (
                      <button
                        onClick={() => updateStatus(c.id, "approved")}
                        className="px-3 py-1.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-lg text-xs font-medium hover:bg-green-500/20 transition"
                      >
                        Approve
                      </button>
                    )}
                    {c.status === "approved" && (
                      <button
                        onClick={() => updateStatus(c.id, "banned")}
                        className="px-3 py-1.5 border border-white/10 rounded-lg text-xs text-red-400/60 hover:text-red-400 transition"
                      >
                        Ban
                      </button>
                    )}
                    {c.status === "banned" && (
                      <button
                        onClick={() => updateStatus(c.id, "approved")}
                        className="px-3 py-1.5 border border-white/10 rounded-lg text-xs text-green-400/60 hover:text-green-400 transition"
                      >
                        Unban
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <p className="text-white/30 text-center py-8 text-sm">No artists found</p>
            )}
          </div>
        )}
      </div>
    </PageShell>
  );
}
