"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import Image from "next/image";
import PageShell from "@/components/PageShell";
import Header from "@/components/Header";
import { DoodleScatter } from "@/components/Doodles";

interface MemberData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  status: string;
  membership_token: string;
  created_at: string;
  visit_count: number;
  last_checkin: string | null;
  upcoming_shows: {
    id: string;
    show_name: string;
    show_date: string;
    start_time: string;
    venue: string;
    eventbrite_url: string;
  }[];
}

export default function MemberAccountPage() {
  const [member, setMember] = useState<MemberData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Edit form state
  const [editing, setEditing] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  // Cancel membership
  const [showCancel, setShowCancel] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  // QR code + light/dark mode
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [qrLight, setQrLight] = useState(true);

  const router = useRouter();

  useEffect(() => {
    async function loadAccount() {
      try {
        const res = await fetch("/api/members/account");
        if (!res.ok) {
          if (res.status === 401) {
            router.push("/members/login");
            return;
          }
          throw new Error("Failed to load account");
        }
        const data = await res.json();
        setMember(data);
        setFirstName(data.first_name);
        setLastName(data.last_name);
        setPhone(data.phone || "");

        // Generate QR code URL
        const baseUrl = window.location.origin;
        const scanUrl = `${baseUrl}/scan/m/${data.membership_token}`;
        setQrDataUrl(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(scanUrl)}`);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    loadAccount();
  }, [router]);

  async function handleSave() {
    setSaving(true);
    setSaveMsg("");
    try {
      const res = await fetch("/api/members/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          phone: phone || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }

      const updated = await res.json();
      setMember((prev) => prev ? { ...prev, ...updated } : prev);
      setEditing(false);
      setSaveMsg("Saved!");
      setTimeout(() => setSaveMsg(""), 2000);
    } catch (err) {
      setSaveMsg(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handleCancel() {
    if (!member) return;
    setCancelling(true);
    try {
      const res = await fetch("/api/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: member.membership_token }),
      });
      if (!res.ok) throw new Error();
      setMember({ ...member, status: "cancelled" });
      setShowCancel(false);
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setCancelling(false);
    }
  }

  async function handleLogout() {
    const supabase = createSupabaseBrowser();
    await supabase.auth.signOut();
    router.push("/");
  }

  const isActive = member && ["active", "vip", "staff", "comp"].includes(member.status);

  if (loading) {
    return (
      <PageShell>
        <Header />
        <main className="flex flex-col items-center justify-center min-h-screen px-6">
          <div className="text-white/40 text-sm">Loading...</div>
        </main>
      </PageShell>
    );
  }

  if (error || !member) {
    return (
      <PageShell>
        <Header />
        <main className="flex flex-col items-center justify-center min-h-screen px-6">
          <div className="text-red-400 text-sm">{error || "Account not found"}</div>
        </main>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <Header />
      <DoodleScatter variant="login" />
      <main className="flex flex-col items-center px-6 pt-12 pb-24">
        {/* Member Card */}
        <div className="max-w-sm w-full bg-white/[0.04] rounded-2xl border border-kc-purple/15 overflow-hidden">
          <div className="px-6 py-5 text-center border-b border-kc-purple/10">
            <Image src="/kc-logo-v3.png" alt="Kings Court" width={48} height={48} className="mx-auto mb-2 rounded" />
            <h1 className="text-lg font-semibold text-white">Kings Court Boston</h1>
            <p className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5">Member Card</p>
          </div>

          <div className="p-8 text-center">
            {isActive && qrDataUrl && (
              <div className="mb-4">
                <div
                  className={`rounded-xl p-4 inline-block transition-colors duration-300 ${
                    qrLight ? "bg-white" : "bg-gray-900 border border-white/10"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={qrLight
                      ? qrDataUrl
                      : `${qrDataUrl}&color=fff&bgcolor=111`
                    }
                    alt="Membership QR Code"
                    className="w-48 h-48"
                  />
                </div>
                {/* Light/Dark toggle */}
                <button
                  onClick={() => setQrLight(!qrLight)}
                  className="mt-2 inline-flex items-center gap-1.5 text-white/30 text-[10px] hover:text-white/50 transition"
                >
                  {qrLight ? (
                    <>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                      </svg>
                      Dark mode
                    </>
                  ) : (
                    <>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      Light mode
                    </>
                  )}
                </button>
              </div>
            )}

            <h2 className="text-2xl font-bold text-white">
              {member.first_name} {member.last_name}
            </h2>

            <span
              className={`inline-block mt-2 px-3 py-1 rounded-full text-[10px] font-medium ${
                isActive
                  ? member.status === "vip" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    : member.status === "staff" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    : member.status === "comp" ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                    : "bg-green-500/10 text-green-400 border border-green-500/20"
                  : "bg-red-500/10 text-red-400 border border-red-500/20"
              }`}
            >
              {member.status === "vip" ? "VIP" : member.status}
            </span>

            {/* Visit counter */}
            {isActive && (
              <div className="mt-4 flex items-center justify-center gap-3">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{member.visit_count}</p>
                  <p className="text-[10px] text-white/30 uppercase tracking-wider">Visits</p>
                </div>
                {member.last_checkin && (
                  <>
                    <div className="w-px h-8 bg-white/10" />
                    <div className="text-center">
                      <p className="text-sm font-medium text-white">
                        {new Date(member.last_checkin).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </p>
                      <p className="text-[10px] text-white/30 uppercase tracking-wider">Last visit</p>
                    </div>
                  </>
                )}
              </div>
            )}

            {isActive && (
              <p className="text-white/30 text-xs mt-5">Show this QR code at check-in</p>
            )}

            {/* Apple Wallet button */}
            {isActive && (
              <div className="mt-5">
                <a
                  href={`/api/wallet/apple/${member.membership_token}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-black border border-white/20 rounded-xl text-white text-sm font-medium hover:bg-white/10 transition"
                >
                  <svg className="w-5 h-6" viewBox="0 0 24 30" fill="currentColor">
                    <path d="M20.8 27.4c-1.2 1.4-2.5 1.2-3.8.5-1.3-.7-2.5-.7-3.9 0-1.7.9-2.6.7-3.7-.5C4.2 21.6 5 13.5 10.6 13.2c1.5.1 2.6.9 3.4.9.8 0 2.3-1.1 3.9-.9 1.7.1 2.9.8 3.7 2.1-3.4 2-2.6 6.5.5 7.8-.6 1.6-1.4 3.2-2.5 4.3zM15.5 13.1c-.1-3 2.4-5.4 4.5-5.6.4 3.3-3 5.7-4.5 5.6z"/>
                  </svg>
                  Add to Apple Wallet
                </a>
              </div>
            )}

            {!isActive && (
              <p className="text-white/30 text-xs mt-6">Your membership is {member.status}.</p>
            )}
          </div>
        </div>

        {/* Upcoming Events */}
        {member.upcoming_shows.length > 0 && (
          <div className="max-w-sm w-full mt-6 bg-white/[0.04] rounded-2xl border border-kc-purple/15 overflow-hidden">
            <div className="px-6 py-4 border-b border-kc-purple/10">
              <h2 className="text-sm font-semibold text-white">Upcoming Events</h2>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {member.upcoming_shows.map((show) => (
                <div key={show.id} className="px-6 py-4 flex items-center gap-4">
                  <div className="shrink-0 w-11 h-11 bg-kc-purple/10 rounded-xl flex flex-col items-center justify-center">
                    <span className="text-[10px] text-kc-purple-light uppercase font-medium leading-none">
                      {new Date(show.show_date + "T00:00:00").toLocaleDateString("en-US", { month: "short" })}
                    </span>
                    <span className="text-sm font-bold text-white leading-none mt-0.5">
                      {new Date(show.show_date + "T00:00:00").getDate()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{show.show_name}</p>
                    <p className="text-xs text-white/40">
                      {show.start_time.slice(0, 5).replace(/^0/, "")} · {show.venue}
                    </p>
                  </div>
                  {show.eventbrite_url && (
                    <a
                      href={show.eventbrite_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 text-[10px] text-kc-purple-light border border-kc-purple/20 rounded-lg px-2.5 py-1.5 hover:bg-kc-purple/10 transition"
                    >
                      RSVP
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Account Settings */}
        <div className="max-w-sm w-full mt-6 bg-white/[0.04] rounded-2xl border border-kc-purple/15 overflow-hidden">
          <div className="px-6 py-4 border-b border-kc-purple/10 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">Account Settings</h2>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="text-xs text-white/40 hover:text-white/70 transition"
              >
                Edit
              </button>
            )}
          </div>

          <div className="p-6 space-y-4">
            {editing ? (
              <>
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1.5">First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white/[0.06] border border-white/10 rounded-xl text-white placeholder-white/20 focus:ring-2 focus:ring-white/20 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1.5">Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white/[0.06] border border-white/10 rounded-xl text-white placeholder-white/20 focus:ring-2 focus:ring-white/20 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1.5">Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white/[0.06] border border-white/10 rounded-xl text-white placeholder-white/20 focus:ring-2 focus:ring-white/20 focus:border-transparent text-sm"
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1.5">Email</label>
                  <div className="px-3.5 py-2.5 bg-white/[0.03] border border-white/5 rounded-xl text-white/40 text-sm">
                    {member.email}
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 py-2.5 bg-white text-black rounded-xl font-semibold hover:bg-white/90 transition disabled:opacity-50 text-sm"
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={() => {
                      setEditing(false);
                      setFirstName(member.first_name);
                      setLastName(member.last_name);
                      setPhone(member.phone || "");
                    }}
                    className="px-4 py-2.5 text-white/40 text-sm hover:text-white/60 transition"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-white/40">Name</span>
                  <span className="text-sm text-white">{member.first_name} {member.last_name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-white/40">Email</span>
                  <span className="text-sm text-white">{member.email}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-white/40">Phone</span>
                  <span className="text-sm text-white">{member.phone || "Not set"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-white/40">Member since</span>
                  <span className="text-sm text-white">
                    {new Date(member.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                  </span>
                </div>
                {saveMsg && (
                  <p className={`text-xs text-center ${saveMsg === "Saved!" ? "text-green-400" : "text-red-400"}`}>
                    {saveMsg}
                  </p>
                )}
              </>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="max-w-sm w-full mt-6 space-y-3">
          {/* Cancel Membership */}
          {isActive && (
            <>
              {!showCancel ? (
                <button
                  onClick={() => setShowCancel(true)}
                  className="w-full text-white/20 text-xs hover:text-white/40 transition py-2"
                >
                  Cancel membership
                </button>
              ) : (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                  <p className="text-white/60 text-xs mb-3 text-center">
                    Are you sure? This will deactivate your membership and QR code.
                  </p>
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={handleCancel}
                      disabled={cancelling}
                      className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-xs font-medium hover:bg-red-500/30 transition disabled:opacity-50"
                    >
                      {cancelling ? "Cancelling..." : "Yes, cancel"}
                    </button>
                    <button
                      onClick={() => setShowCancel(false)}
                      className="px-4 py-2 text-white/40 text-xs hover:text-white/60"
                    >
                      Keep membership
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full py-3 bg-white/[0.06] text-white/60 border border-white/10 rounded-xl text-sm hover:bg-white/10 transition"
          >
            Sign Out
          </button>
        </div>
      </main>
    </PageShell>
  );
}
