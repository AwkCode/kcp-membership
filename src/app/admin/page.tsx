"use client";

import { useEffect, useState, useCallback } from "react";
import StaffHeader from "@/components/StaffHeader";
import PageShell from "@/components/PageShell";

interface Member {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  status: string;
  notes: string;
  membership_token: string;
  created_at: string;
}

export default function AdminPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ status: "", notes: "" });
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState("");

  const fetchMembers = useCallback(async () => {
    try {
      const res = await fetch("/api/members");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setMembers(data.members);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  function startEdit(m: Member) {
    setEditingId(m.id);
    setEditForm({ status: m.status, notes: m.notes || "" });
  }

  async function saveEdit(id: string) {
    setSaving(true);
    try {
      const res = await fetch(`/api/members/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) throw new Error();
      setEditingId(null);
      fetchMembers();
    } catch {
      alert("Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function rotateToken(id: string) {
    if (!confirm("Rotate this member's token? Their old QR code will stop working.")) return;
    try {
      const res = await fetch(`/api/members/${id}/rotate-token`, { method: "POST" });
      if (!res.ok) throw new Error();
      fetchMembers();
    } catch {
      alert("Rotation failed");
    }
  }

  const filtered = members.filter((m) => {
    if (!filter) return true;
    const q = filter.toLowerCase();
    return (
      m.first_name.toLowerCase().includes(q) ||
      m.last_name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q)
    );
  });

  return (
    <PageShell>
      <StaffHeader />
      <div className="max-w-4xl mx-auto p-4">
        <input
          type="text"
          placeholder="Filter members..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full px-4 py-2.5 bg-white/[0.06] border border-white/10 rounded-xl text-white placeholder-white/30 focus:ring-2 focus:ring-white/20 focus:border-transparent mb-4 text-sm"
        />

        {loading ? (
          <p className="text-white/30 text-center py-8 text-sm">Loading...</p>
        ) : (
          <div className="space-y-2">
            {filtered.map((m) => (
              <div key={m.id} className="bg-white/[0.06] backdrop-blur-xl border border-white/[0.06] rounded-xl p-4">
                {editingId === m.id ? (
                  <div className="space-y-3">
                    <p className="font-medium text-white text-sm">
                      {m.first_name} {m.last_name}{" "}
                      <span className="text-white/30 font-normal text-xs">{m.email}</span>
                    </p>
                    <div>
                      <label className="block text-xs font-medium text-white/60 mb-1">Status</label>
                      <select
                        value={editForm.status}
                        onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                        className="w-full px-3 py-2 bg-white/[0.06] border border-white/10 rounded-lg text-white text-sm"
                      >
                        <option value="active">Active</option>
                        <option value="suspended">Suspended</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-white/60 mb-1">Notes</label>
                      <textarea
                        value={editForm.notes}
                        onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                        className="w-full px-3 py-2 bg-white/[0.06] border border-white/10 rounded-lg text-white text-sm"
                        rows={2}
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveEdit(m.id)}
                        disabled={saving}
                        className="px-4 py-2 bg-white text-black rounded-lg text-sm font-medium disabled:opacity-50"
                      >
                        {saving ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-4 py-2 text-white/40 text-sm hover:text-white/60"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white text-sm">
                        {m.first_name} {m.last_name}
                      </p>
                      <p className="text-white/30 text-xs">
                        {m.email} {m.phone ? `| ${m.phone}` : ""}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${
                            m.status === "active"
                              ? "bg-green-500/10 text-green-400 border border-green-500/20"
                              : m.status === "suspended"
                              ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                              : "bg-red-500/10 text-red-400 border border-red-500/20"
                          }`}
                        >
                          {m.status}
                        </span>
                        {m.notes && (
                          <span className="text-white/30 text-xs truncate max-w-[200px]">
                            {m.notes}
                          </span>
                        )}
                      </div>
                      <p className="text-white/20 text-xs mt-1">
                        Joined {new Date(m.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(m)}
                        className="px-3 py-1.5 border border-white/10 rounded-lg text-sm text-white/60 hover:text-white hover:border-white/20 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => rotateToken(m.id)}
                        className="px-3 py-1.5 border border-white/10 rounded-lg text-sm text-white/30 hover:text-white/60 hover:border-white/20 transition"
                        title="Generate new QR code"
                      >
                        Rotate
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {filtered.length === 0 && (
              <p className="text-white/30 text-center py-8 text-sm">No members found</p>
            )}
          </div>
        )}
      </div>
    </PageShell>
  );
}
