"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import jsQR from "jsqr";
import StaffHeader from "@/components/StaffHeader";
import PageShell from "@/components/PageShell";

const VALID_STATUSES = ["active", "vip", "staff", "comp"];

interface MemberInfo {
  id: string;
  first_name: string;
  last_name: string;
  status: string;
  notes: string;
  created_at: string;
  last_checkin: string | null;
  visit_count: number;
}

export default function ScanPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [member, setMember] = useState<MemberInfo | null>(null);
  const [error, setError] = useState("");
  const [scanning, setScanning] = useState(true);
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkingIn, setCheckingIn] = useState(false);
  const [checkinNotes, setCheckinNotes] = useState("");
  const scanningRef = useRef(true);
  const lastScannedRef = useRef("");

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      setError("Could not access camera. Make sure you allow camera access.");
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((t) => t.stop());
    }
  }, []);

  const lookupToken = useCallback(async (token: string) => {
    if (token === lastScannedRef.current) return;
    lastScannedRef.current = token;
    setError("");
    try {
      const res = await fetch(`/api/scan/m/${token}`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Lookup failed");
      }
      const data = await res.json();
      setMember(data.member);
      setScanning(false);
      scanningRef.current = false;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Lookup failed");
      lastScannedRef.current = "";
    }
  }, []);

  useEffect(() => {
    startCamera();

    let animationId: number;
    let frameCount = 0;

    const scanFrame = () => {
      if (!scanningRef.current || !videoRef.current || !canvasRef.current) {
        animationId = requestAnimationFrame(scanFrame);
        return;
      }

      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (video.readyState !== video.HAVE_ENOUGH_DATA) {
        animationId = requestAnimationFrame(scanFrame);
        return;
      }

      // Scan every 3rd frame for performance
      frameCount++;
      if (frameCount % 3 !== 0) {
        animationId = requestAnimationFrame(scanFrame);
        return;
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(video, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert",
      });

      if (code) {
        const match = code.data.match(/\/scan\/m\/([A-Za-z0-9_-]+)/);
        if (match) {
          scanningRef.current = false;
          lookupToken(match[1]);
          return;
        }
      }

      animationId = requestAnimationFrame(scanFrame);
    };

    animationId = requestAnimationFrame(scanFrame);

    return () => {
      cancelAnimationFrame(animationId);
      stopCamera();
    };
  }, [startCamera, stopCamera, lookupToken]);

  async function handleCheckin() {
    if (!member) return;
    setCheckingIn(true);
    try {
      const res = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ member_id: member.id, notes: checkinNotes || undefined }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }
      setCheckedIn(true);
      // Auto-reset after 3 seconds for continuous scanning
      setTimeout(() => resetScan(), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Check-in failed");
    } finally {
      setCheckingIn(false);
    }
  }

  function resetScan() {
    setMember(null);
    setError("");
    setCheckedIn(false);
    setCheckinNotes("");
    lastScannedRef.current = "";
    setScanning(true);
    scanningRef.current = true;
    startCamera();
  }

  const isValid = member && VALID_STATUSES.includes(member.status);

  const statusLabel: Record<string, string> = {
    active: "Verified Member",
    vip: "VIP Member",
    staff: "Staff",
    comp: "Comp",
    suspended: "Suspended",
    expired: "Expired",
    cancelled: "Cancelled",
  };

  return (
    <PageShell>
      <StaffHeader />
      <div className="max-w-lg mx-auto p-4">

        {scanning && (
          <>
            <div className="relative rounded-2xl overflow-hidden bg-black aspect-[4/3]">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 border border-white/10 rounded-2xl" />
              {/* Scanning crosshair */}
              <div className="absolute inset-[15%] border-2 border-white/30 rounded-lg">
                <div className="absolute -top-0.5 -left-0.5 w-6 h-6 border-t-2 border-l-2 border-white rounded-tl-lg" />
                <div className="absolute -top-0.5 -right-0.5 w-6 h-6 border-t-2 border-r-2 border-white rounded-tr-lg" />
                <div className="absolute -bottom-0.5 -left-0.5 w-6 h-6 border-b-2 border-l-2 border-white rounded-bl-lg" />
                <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 border-b-2 border-r-2 border-white rounded-br-lg" />
              </div>
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <span className="bg-black/60 text-white/80 px-4 py-1.5 rounded-full text-xs backdrop-blur-sm">
                  Scanning...
                </span>
              </div>
            </div>
            <canvas ref={canvasRef} className="hidden" />
          </>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mt-4 text-sm text-center">
            {error}
            <button onClick={resetScan} className="block mx-auto mt-2 text-white/40 text-xs underline">
              Try again
            </button>
          </div>
        )}

        {member && (
          <div className="mt-4">
            <div className="bg-white/[0.06] backdrop-blur-xl rounded-2xl border border-white/[0.06] overflow-hidden">
              {/* Status banner — large and clear */}
              <div className={`px-6 py-8 text-center ${
                isValid
                  ? "bg-green-500/10 border-b border-green-500/20"
                  : "bg-red-500/10 border-b border-red-500/20"
              }`}>
                <div className={`w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center ${
                  isValid ? "bg-green-500/20" : "bg-red-500/20"
                }`}>
                  {isValid ? (
                    <svg className="w-9 h-9 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg className="w-9 h-9 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                  )}
                </div>
                <h2 className={`text-lg font-bold ${isValid ? "text-green-400" : "text-red-400"}`}>
                  {isValid ? statusLabel[member.status] || "Verified" : "NOT VALID"}
                </h2>
                {!isValid && (
                  <p className="text-red-400/60 text-sm mt-1">
                    {statusLabel[member.status] || member.status}
                  </p>
                )}
              </div>

              {/* Member name — large for door staff */}
              <div className="px-6 py-5">
                <h3 className="text-3xl font-bold text-center text-white">
                  {member.first_name} {member.last_name}
                </h3>

                {member.status !== "active" && member.status !== "cancelled" && member.status !== "expired" && member.status !== "suspended" && (
                  <p className="text-center mt-1">
                    <span className={`inline-block px-3 py-0.5 rounded-full text-xs font-medium ${
                      member.status === "vip" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        : member.status === "staff" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                        : "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                    }`}>
                      {member.status.toUpperCase()}
                    </span>
                  </p>
                )}

                {member.visit_count > 0 && (
                  <p className="text-center text-white/50 text-sm mt-2">
                    Visit #{member.visit_count + 1}
                  </p>
                )}

                {member.notes && (
                  <p className="mt-3 text-white/40 text-sm bg-white/[0.04] rounded-xl p-3 text-center">
                    {member.notes}
                  </p>
                )}

                <div className="mt-3 flex items-center justify-center gap-1.5 text-white/30 text-xs">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>
                    {member.visit_count === 0
                      ? "First visit!"
                      : `${member.visit_count} previous visits · Last: ${new Date(member.last_checkin!).toLocaleDateString()}`}
                  </span>
                </div>
              </div>

              {/* Action area */}
              <div className="px-6 pb-5 space-y-3">
                {!checkedIn && isValid && (
                  <input
                    type="text"
                    placeholder="Add a note (optional)..."
                    value={checkinNotes}
                    onChange={(e) => setCheckinNotes(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-white placeholder-white/20 text-sm"
                  />
                )}

                {checkedIn ? (
                  <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-5 rounded-xl text-center font-bold text-xl flex items-center justify-center gap-2">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    Checked In
                  </div>
                ) : isValid ? (
                  <button
                    onClick={handleCheckin}
                    disabled={checkingIn}
                    className="w-full py-4 bg-white text-black rounded-xl font-semibold text-lg hover:bg-white/90 transition disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {checkingIn ? "Checking in..." : "Check In"}
                  </button>
                ) : (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-4 rounded-xl text-center font-semibold">
                    Cannot check in — membership {member.status}
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={resetScan}
              className="mt-3 w-full py-3 text-white/40 text-sm hover:text-white/60 transition border border-white/10 rounded-xl"
            >
              Scan Another
            </button>
          </div>
        )}
      </div>
    </PageShell>
  );
}
