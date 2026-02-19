"use client";

import { useEffect, useState, useCallback } from "react";
import ComedianHeader from "@/components/ComedianHeader";
import PageShell from "@/components/PageShell";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface ComedianProfile {
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
  tags: string[];
  status: string;
  created_at: string;
}

export default function ComedianProfilePage() {
  const [comedian, setComedian] = useState<ComedianProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Partial<ComedianProfile>>({});
  const [videoInput, setVideoInput] = useState("");
  const router = useRouter();

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch("/api/comedians/me");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setComedian(data.comedian);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  function startEdit() {
    if (!comedian) return;
    setForm({
      display_name: comedian.display_name,
      legal_name: comedian.legal_name || "",
      phone: comedian.phone || "",
      city: comedian.city || "",
      state: comedian.state || "",
      bio: comedian.bio || "",
      instagram: comedian.instagram || "",
      video_links: comedian.video_links || [],
      tags: comedian.tags || [],
    });
    setEditing(true);
  }

  async function saveProfile() {
    setSaving(true);
    try {
      const res = await fetch("/api/comedians/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setEditing(false);
      fetchProfile();
    } catch {
      alert("Save failed");
    } finally {
      setSaving(false);
    }
  }

  function addVideo() {
    if (!videoInput.trim()) return;
    setForm({ ...form, video_links: [...(form.video_links || []), videoInput.trim()] });
    setVideoInput("");
  }

  function removeVideo(index: number) {
    setForm({
      ...form,
      video_links: (form.video_links || []).filter((_, i) => i !== index),
    });
  }

  async function handleLogout() {
    const supabase = createSupabaseBrowser();
    await supabase.auth.signOut();
    router.push("/comedians/login");
  }

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    approved: "bg-green-500/10 text-green-400 border-green-500/20",
    banned: "bg-red-500/10 text-red-400 border-red-500/20",
  };

  return (
    <PageShell>
      <ComedianHeader />
      <div className="max-w-2xl mx-auto p-4 sm:p-6">
        {loading ? (
          <p className="text-white/30 text-center py-8 text-sm">Loading...</p>
        ) : !comedian ? (
          <p className="text-white/30 text-center py-8 text-sm">Profile not found</p>
        ) : editing ? (
          <div className="bg-white/[0.06] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-white">Edit Profile</h2>

            <div>
              <label className="block text-xs font-medium text-white/60 mb-1.5">Display Name</label>
              <input
                type="text"
                value={form.display_name || ""}
                onChange={(e) => setForm({ ...form, display_name: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white/[0.06] border border-white/10 rounded-xl text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-white/60 mb-1.5">Legal Name</label>
              <input
                type="text"
                value={(form.legal_name as string) || ""}
                onChange={(e) => setForm({ ...form, legal_name: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white/[0.06] border border-white/10 rounded-xl text-white text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-white/60 mb-1.5">City</label>
                <input
                  type="text"
                  value={(form.city as string) || ""}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white/[0.06] border border-white/10 rounded-xl text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/60 mb-1.5">State</label>
                <input
                  type="text"
                  value={(form.state as string) || ""}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white/[0.06] border border-white/10 rounded-xl text-white text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-white/60 mb-1.5">Phone</label>
              <input
                type="tel"
                value={(form.phone as string) || ""}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white/[0.06] border border-white/10 rounded-xl text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-white/60 mb-1.5">Instagram</label>
              <input
                type="text"
                value={(form.instagram as string) || ""}
                onChange={(e) => setForm({ ...form, instagram: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white/[0.06] border border-white/10 rounded-xl text-white text-sm"
                placeholder="@handle"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-white/60 mb-1.5">Bio</label>
              <textarea
                value={form.bio || ""}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-white/[0.06] border border-white/10 rounded-xl text-white text-sm"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-white/60 mb-1.5">Video Links</label>
              {(form.video_links || []).map((link, i) => (
                <div key={i} className="flex items-center gap-2 mb-2">
                  <span className="text-white/50 text-xs truncate flex-1">{link}</span>
                  <button onClick={() => removeVideo(i)} className="text-red-400 text-xs hover:text-red-300">Remove</button>
                </div>
              ))}
              <div className="flex gap-2">
                <input
                  type="url"
                  value={videoInput}
                  onChange={(e) => setVideoInput(e.target.value)}
                  className="flex-1 px-3.5 py-2 bg-white/[0.06] border border-white/10 rounded-xl text-white text-sm"
                  placeholder="https://youtube.com/..."
                />
                <button
                  type="button"
                  onClick={addVideo}
                  className="px-3 py-2 border border-white/10 rounded-xl text-sm text-white/60 hover:text-white"
                >
                  Add
                </button>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={saveProfile}
                disabled={saving}
                className="px-6 py-2.5 bg-white text-black rounded-xl font-semibold text-sm disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => setEditing(false)}
                className="px-6 py-2.5 text-white/40 text-sm hover:text-white/60"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/[0.06] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-xl font-bold text-white">{comedian.display_name}</h1>
                {comedian.legal_name && (
                  <p className="text-white/30 text-xs">{comedian.legal_name}</p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium border ${statusColors[comedian.status] || "bg-white/10 text-white/60 border-white/10"}`}>
                    {comedian.status}
                  </span>
                  {comedian.city && comedian.state && (
                    <span className="text-white/30 text-xs">{comedian.city}, {comedian.state}</span>
                  )}
                </div>
              </div>
              <button
                onClick={startEdit}
                className="px-4 py-2 border border-white/10 rounded-xl text-sm text-white/60 hover:text-white hover:border-white/20 transition"
              >
                Edit
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wide mb-1">Email</p>
                <p className="text-white text-sm">{comedian.email}</p>
              </div>
              {comedian.phone && (
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-wide mb-1">Phone</p>
                  <p className="text-white text-sm">{comedian.phone}</p>
                </div>
              )}
              {comedian.instagram && (
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-wide mb-1">Instagram</p>
                  <p className="text-white text-sm">{comedian.instagram}</p>
                </div>
              )}
              {comedian.bio && (
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-wide mb-1">Bio</p>
                  <p className="text-white/70 text-sm">{comedian.bio}</p>
                </div>
              )}
              {comedian.video_links && comedian.video_links.length > 0 && (
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-wide mb-1">Videos</p>
                  {comedian.video_links.map((link, i) => (
                    <a key={i} href={link} target="_blank" rel="noopener noreferrer"
                      className="block text-blue-400 text-sm underline truncate hover:text-blue-300">
                      {link}
                    </a>
                  ))}
                </div>
              )}
              <div>
                <p className="text-white/40 text-xs uppercase tracking-wide mb-1">Member Since</p>
                <p className="text-white/50 text-sm">{new Date(comedian.created_at).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/[0.06]">
              <button
                onClick={handleLogout}
                className="text-white/30 text-xs hover:text-white/60 transition"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
}
