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
    <div className="max-w-sm w-full bg-white/[0.04] rounded-2xl border border-kc-purple/15 overflow-hidden">
      <div className="px-6 py-5 text-center border-b border-kc-purple/10">
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

        {/* Wallet buttons */}
        {["active", "vip", "staff", "comp"].includes(status) && (
          <div className="mt-5 flex flex-col items-center gap-2.5">
            <a
              href={`/api/wallet/apple/${token}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-black border border-white/20 rounded-xl text-white text-sm font-medium hover:bg-white/10 transition"
            >
              <svg className="w-5 h-6" viewBox="0 0 24 30" fill="currentColor">
                <path d="M20.8 27.4c-1.2 1.4-2.5 1.2-3.8.5-1.3-.7-2.5-.7-3.9 0-1.7.9-2.6.7-3.7-.5C4.2 21.6 5 13.5 10.6 13.2c1.5.1 2.6.9 3.4.9.8 0 2.3-1.1 3.9-.9 1.7.1 2.9.8 3.7 2.1-3.4 2-2.6 6.5.5 7.8-.6 1.6-1.4 3.2-2.5 4.3zM15.5 13.1c-.1-3 2.4-5.4 4.5-5.6.4 3.3-3 5.7-4.5 5.6z"/>
              </svg>
              Add to Apple Wallet
            </a>
            <a
              href={`/api/wallet/google/${token}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-black border border-white/20 rounded-xl text-white text-sm font-medium hover:bg-white/10 transition"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.78.43 3.46 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Add to Google Wallet
            </a>
          </div>
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
