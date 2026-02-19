"use client";

import { useState } from "react";
import Image from "next/image";

interface Props {
  firstName: string;
  lastName: string;
  status: string;
  token: string;
  qrDataUrl: string;
}

export default function MemberCard({ firstName, lastName, status: initialStatus, token, qrDataUrl }: Props) {
  const [status, setStatus] = useState(initialStatus);
  const [showConfirm, setShowConfirm] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  async function handleCancel() {
    setCancelling(true);
    try {
      const res = await fetch("/api/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      if (!res.ok) throw new Error();
      setStatus("cancelled");
      setShowConfirm(false);
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setCancelling(false);
    }
  }

  return (
    <div className="max-w-sm w-full bg-white/[0.06] backdrop-blur-xl rounded-2xl border border-white/[0.06] overflow-hidden">
      <div className="px-6 py-5 text-center border-b border-white/[0.06]">
        <Image src="/kc-logo-v3.png" alt="Kings Court" width={48} height={48} className="mx-auto mb-2 rounded" />
        <h1 className="text-lg font-semibold text-white">Kings Court Boston</h1>
        <p className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5">Member Card</p>
      </div>

      <div className="p-8 text-center">
        {["active", "vip", "staff", "comp"].includes(status) && (
          <div className="mb-5 bg-white rounded-xl p-4 inline-block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrDataUrl} alt="Membership QR Code" className="w-48 h-48" />
          </div>
        )}

        <h2 className="text-2xl font-bold text-white">
          {firstName} {lastName}
        </h2>

        <span
          className={`inline-block mt-2 px-3 py-1 rounded-full text-[10px] font-medium ${
            ["active", "vip", "staff", "comp"].includes(status)
              ? status === "vip" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                : status === "staff" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                : status === "comp" ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                : "bg-green-500/10 text-green-400 border border-green-500/20"
              : "bg-red-500/10 text-red-400 border border-red-500/20"
          }`}
        >
          {status === "vip" ? "VIP" : status}
        </span>

        {["active", "vip", "staff", "comp"].includes(status) && (
          <p className="text-white/30 text-xs mt-6">Show this QR code at check-in</p>
        )}

        {["cancelled", "suspended", "expired"].includes(status) && (
          <p className="text-white/30 text-xs mt-6">Your membership is {status}.</p>
        )}
      </div>

      {["active", "vip", "staff", "comp"].includes(status) && (
        <div className="px-6 pb-6 text-center">
          {!showConfirm ? (
            <button
              onClick={() => setShowConfirm(true)}
              className="text-white/20 text-xs hover:text-white/40 transition"
            >
              Cancel membership
            </button>
          ) : (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
              <p className="text-white/60 text-xs mb-3">
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
                  onClick={() => setShowConfirm(false)}
                  className="px-4 py-2 text-white/40 text-xs hover:text-white/60"
                >
                  Keep membership
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
