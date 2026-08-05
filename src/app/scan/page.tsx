"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import jsQR from "jsqr";
import StaffHeader from "@/components/StaffHeader";
import PageShell from "@/components/PageShell";

const VALID_STATUSES = ["active", "vip", "staff", "comp"];

type ScanStatus =
  | "scanning"
  | "found"
  | "unrecognized"
  | "verifying"
  | "verified"
  | "invalid"
  | "not-found"
  | "error"
  | "checked-in";

interface MemberInfo {
  id: string;
  first_name: string;
  last_name: string;
  status: string;
  tier?: string;
  notes: string;
  created_at: string;
  last_checkin: string | null;
  visit_count: number;
}

interface ScanResult {
  status: ScanStatus;
  member?: MemberInfo;
  error?: string;
}

export default function ScanPage() {
  const [result, setResult] = useState<ScanResult | null>(null);
  const [checkingIn, setCheckingIn] = useState(false);
  const [checkinNotes, setCheckinNotes] = useState("");
  const [scanKey, setScanKey] = useState(0);

  const member = result?.member ?? null;
  const scanStatus = result?.status ?? "scanning";
  const isValid = member && VALID_STATUSES.includes(member.status);
  const showScanner = !result || ["scanning", "found", "unrecognized", "verifying", "not-found", "error"].includes(result.status);

  function handleScanResult(r: ScanResult) {
    setResult(r);
  }

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
      setResult({ status: "checked-in", member });
      setTimeout(() => resetScan(), 3000);
    } catch (err: unknown) {
      setResult({ status: "error", error: err instanceof Error ? err.message : "Check-in failed" });
    } finally {
      setCheckingIn(false);
    }
  }

  function resetScan() {
    setResult(null);
    setCheckinNotes("");
    setScanKey((k) => k + 1);
  }

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

        {showScanner && (
          <Scanner key={scanKey} onResult={handleScanResult} />
        )}

        {/* Status banner below camera */}
        {showScanner && (
          <StatusBanner status={scanStatus} error={result?.error} />
        )}

        {/* Tap to retry */}
        {(scanStatus === "not-found" || scanStatus === "error") && (
          <button
            onClick={resetScan}
            className="mt-2 w-full py-2.5 text-white/40 text-sm hover:text-white/60 transition border border-white/10 rounded-xl"
          >
            Tap to scan again
          </button>
        )}

        {/* Member result card */}
        {member && (scanStatus === "verified" || scanStatus === "invalid" || scanStatus === "checked-in") && (
          <div className="mt-4">
            <div className="bg-white/[0.04] rounded-2xl border border-kc-purple/10 overflow-hidden">
              <div className={`px-6 py-8 text-center ${
                scanStatus === "checked-in" || isValid
                  ? "bg-green-500/10 border-b border-green-500/20"
                  : "bg-red-500/10 border-b border-red-500/20"
              }`}>
                <div className={`w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center ${
                  scanStatus === "checked-in" || isValid ? "bg-green-500/20" : "bg-red-500/20"
                }`}>
                  {scanStatus === "checked-in" ? (
                    <svg className="w-9 h-9 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : isValid ? (
                    <svg className="w-9 h-9 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg className="w-9 h-9 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                  )}
                </div>
                <h2 className={`text-lg font-bold ${
                  scanStatus === "checked-in" || isValid ? "text-green-400" : "text-red-400"
                }`}>
                  {scanStatus === "checked-in"
                    ? "Checked In"
                    : isValid
                      ? statusLabel[member.status] || "Verified"
                      : "NOT VALID"}
                </h2>
                {!isValid && scanStatus !== "checked-in" && (
                  <p className="text-red-400/60 text-sm mt-1">
                    {statusLabel[member.status] || member.status}
                  </p>
                )}
              </div>

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

              <div className="px-6 pb-5 space-y-3">
                {scanStatus === "verified" && isValid && (
                  <input
                    type="text"
                    placeholder="Add a note (optional)..."
                    value={checkinNotes}
                    onChange={(e) => setCheckinNotes(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-white placeholder-white/20 text-sm"
                  />
                )}

                {scanStatus === "checked-in" ? (
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

/**
 * Self-contained scanner component. Owns its own video element, canvas,
 * camera stream, and scan loop. When unmounted, everything is cleaned up.
 * When remounted (via key change), everything starts completely fresh.
 */
function Scanner({ onResult }: { onResult: (r: ScanResult) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(true);
  const lastTokenRef = useRef("");
  const [localStatus, setLocalStatus] = useState<"scanning" | "found" | "unrecognized" | "verifying">("scanning");

  const lookupToken = useCallback(async (token: string) => {
    if (token === lastTokenRef.current) return;
    lastTokenRef.current = token;
    setLocalStatus("verifying");
    onResult({ status: "verifying" });

    try {
      const res = await fetch(`/api/scan/m/${token}`);
      if (!res.ok) {
        const data = await res.json();
        if (res.status === 404) {
          onResult({ status: "not-found", error: "This QR code doesn't match any member in the system." });
        } else if (res.status === 401) {
          onResult({ status: "error", error: "Session expired. Please refresh and log in again." });
        } else {
          onResult({ status: "error", error: data.error || "Lookup failed" });
        }
        setTimeout(() => { lastTokenRef.current = ""; }, 3000);
        return;
      }
      const data = await res.json();
      activeRef.current = false;
      const member = data.member;
      if (VALID_STATUSES.includes(member.status)) {
        onResult({ status: "verified", member });
      } else {
        onResult({ status: "invalid", member });
      }
    } catch {
      onResult({ status: "error", error: "Network error. Check your connection." });
      lastTokenRef.current = "";
    }
  }, [onResult]);

  useEffect(() => {
    let animationId: number;
    let stream: MediaStream | null = null;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    async function init() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
        });
        if (video && activeRef.current) {
          video.srcObject = stream;
          await video.play().catch(() => {});
          startScanLoop();
        }
      } catch {
        onResult({ status: "error", error: "Could not access camera. Make sure you allow camera access." });
      }
    }

    function startScanLoop() {
      let frameCount = 0;
      let noQrFrames = 0;
      let unrecognizedTimeout: NodeJS.Timeout | null = null;

      const scanFrame = () => {
        if (!activeRef.current) {
          if (unrecognizedTimeout) clearTimeout(unrecognizedTimeout);
          return;
        }

        if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) {
          animationId = requestAnimationFrame(scanFrame);
          return;
        }

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
          noQrFrames = 0;
          const match = code.data.match(/\/scan\/m\/([A-Za-z0-9_-]+)/);
          if (match) {
            setLocalStatus("found");
            onResult({ status: "found" });
            activeRef.current = false;
            lookupToken(match[1]);
            return;
          } else {
            setLocalStatus("unrecognized");
            onResult({ status: "unrecognized", error: "QR code not recognized — not a KC membership" });
            if (unrecognizedTimeout) clearTimeout(unrecognizedTimeout);
            unrecognizedTimeout = setTimeout(() => {
              if (activeRef.current) {
                setLocalStatus("scanning");
                onResult({ status: "scanning" });
              }
            }, 3000);
          }
        } else {
          noQrFrames++;
          if (noQrFrames > 30) {
            setLocalStatus("scanning");
            onResult({ status: "scanning" });
            noQrFrames = 0;
          }
        }

        animationId = requestAnimationFrame(scanFrame);
      };

      animationId = requestAnimationFrame(scanFrame);
    }

    init();

    return () => {
      activeRef.current = false;
      cancelAnimationFrame(animationId);
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
      if (video) {
        video.srcObject = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
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
        <div className={`absolute inset-[15%] border-2 rounded-lg transition-colors duration-300 ${
          localStatus === "unrecognized" ? "border-amber-500/50" :
          localStatus === "found" || localStatus === "verifying" ? "border-blue-500/50" :
          "border-white/30"
        }`}>
          <div className="absolute -top-0.5 -left-0.5 w-6 h-6 border-t-2 border-l-2 border-inherit rounded-tl-lg" />
          <div className="absolute -top-0.5 -right-0.5 w-6 h-6 border-t-2 border-r-2 border-inherit rounded-tr-lg" />
          <div className="absolute -bottom-0.5 -left-0.5 w-6 h-6 border-b-2 border-l-2 border-inherit rounded-bl-lg" />
          <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 border-b-2 border-r-2 border-inherit rounded-br-lg" />
        </div>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </>
  );
}

function StatusBanner({ status, error }: { status: ScanStatus; error?: string }) {
  const config: Record<string, { text: string; color: string; icon: string } | null> = {
    scanning: { text: "Scanning...", color: "bg-white/10 text-white/60", icon: "scan" },
    found: { text: "KC code found — verifying...", color: "bg-blue-500/15 text-blue-400", icon: "loading" },
    unrecognized: { text: "QR code not recognized — not a KC membership", color: "bg-amber-500/15 text-amber-400", icon: "warn" },
    verifying: { text: "Looking up member...", color: "bg-blue-500/15 text-blue-400", icon: "loading" },
    "not-found": { text: "Member not found — old or invalid QR code", color: "bg-red-500/15 text-red-400", icon: "x" },
    error: { text: error || "Something went wrong", color: "bg-red-500/15 text-red-400", icon: "x" },
  };

  const banner = config[status];
  if (!banner) return null;

  return (
    <div className={`mt-3 px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium ${banner.color}`}>
      {banner.icon === "scan" && (
        <div className="animate-pulse">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
        </div>
      )}
      {banner.icon === "loading" && (
        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {banner.icon === "x" && (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      )}
      {banner.icon === "warn" && (
        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      )}
      <span>{banner.text}</span>
    </div>
  );
}
