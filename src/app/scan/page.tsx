"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import StaffHeader from "@/components/StaffHeader";
import PageShell from "@/components/PageShell";

interface MemberInfo {
  id: string;
  first_name: string;
  last_name: string;
  status: string;
  notes: string;
  created_at: string;
  last_checkin: string | null;
}

export default function ScanPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [member, setMember] = useState<MemberInfo | null>(null);
  const [error, setError] = useState("");
  const [scanning, setScanning] = useState(true);
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkingIn, setCheckingIn] = useState(false);
  const scanningRef = useRef(true);
  const [hasBarcodeDetector, setHasBarcodeDetector] = useState(true);

  useEffect(() => {
    setHasBarcodeDetector("BarcodeDetector" in window);
  }, []);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      setError("Could not access camera");
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((t) => t.stop());
    }
  }, []);

  const lookupToken = useCallback(async (token: string) => {
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
    }
  }, []);

  useEffect(() => {
    startCamera();

    let animationId: number;

    const scanFrame = async () => {
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

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(video, 0, 0);

      try {
        if ("BarcodeDetector" in window) {
          const detector = new (window as unknown as { BarcodeDetector: new (opts: { formats: string[] }) => { detect: (src: HTMLCanvasElement) => Promise<{ rawValue: string }[]> } }).BarcodeDetector({
            formats: ["qr_code"],
          });
          const barcodes = await detector.detect(canvas);
          if (barcodes.length > 0) {
            const url = barcodes[0].rawValue;
            const match = url.match(/\/scan\/m\/([A-Za-z0-9_-]+)/);
            if (match) {
              scanningRef.current = false;
              await lookupToken(match[1]);
              return;
            }
          }
        }
      } catch {
        // BarcodeDetector not supported or failed
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
        body: JSON.stringify({ member_id: member.id }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }
      setCheckedIn(true);
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
    setScanning(true);
    scanningRef.current = true;
    startCamera();
  }

  return (
    <PageShell>
      <StaffHeader />
      <div className="max-w-lg mx-auto p-4">

        {scanning && (
          <>
            <div className="relative rounded-2xl overflow-hidden bg-black aspect-square">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 border border-white/10 rounded-2xl" />
              <div className="absolute inset-[20%] border-2 border-white/40 rounded-lg" />
            </div>
            <canvas ref={canvasRef} className="hidden" />
            <p className="text-center text-white/40 text-sm mt-4">
              Point camera at member QR code
            </p>
            {!hasBarcodeDetector && (
              <p className="text-center text-amber-400/80 text-xs mt-1">
                BarcodeDetector not supported. Try Chrome on Android or use Door search.
              </p>
            )}
          </>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mt-4 text-sm">
            {error}
          </div>
        )}

        {member && (
          <div className="mt-4">
            <div className="bg-white/[0.06] backdrop-blur-xl rounded-2xl border border-white/[0.06] overflow-hidden">
              {/* Status banner */}
              <div className={`px-6 py-6 text-center ${
                member.status === "active"
                  ? "bg-green-500/10 border-b border-green-500/20"
                  : "bg-red-500/10 border-b border-red-500/20"
              }`}>
                <div className={`w-14 h-14 mx-auto mb-3 rounded-full flex items-center justify-center ${
                  member.status === "active" ? "bg-green-500/20" : "bg-red-500/20"
                }`}>
                  {member.status === "active" ? (
                    <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                  )}
                </div>
                <h2 className={`text-base font-semibold ${
                  member.status === "active" ? "text-green-400" : "text-red-400"
                }`}>
                  {member.status === "active"
                    ? "Verified Kings Court Member"
                    : `Membership ${member.status.charAt(0).toUpperCase() + member.status.slice(1)}`}
                </h2>
              </div>

              {/* Member details */}
              <div className="px-6 py-5">
                <h3 className="text-2xl font-bold text-center text-white">
                  {member.first_name} {member.last_name}
                </h3>

                {member.notes && (
                  <p className="mt-3 text-white/40 text-sm bg-white/[0.04] rounded-xl p-3 text-center">
                    {member.notes}
                  </p>
                )}

                <div className="mt-4 flex items-center justify-center gap-1.5 text-white/30 text-xs">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>
                    Last check-in:{" "}
                    {member.last_checkin
                      ? new Date(member.last_checkin).toLocaleString()
                      : "First visit"}
                  </span>
                </div>
              </div>

              {/* Action area */}
              <div className="px-6 pb-5">
                {checkedIn ? (
                  <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-4 rounded-xl text-center font-semibold text-lg flex items-center justify-center gap-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    Checked In
                  </div>
                ) : (
                  <button
                    onClick={handleCheckin}
                    disabled={checkingIn || member.status !== "active"}
                    className="w-full py-4 bg-white text-black rounded-xl font-semibold text-base hover:bg-white/90 transition disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {checkingIn ? "Checking in..." : "Check In"}
                  </button>
                )}
              </div>
            </div>

            <button
              onClick={resetScan}
              className="mt-3 w-full py-2 text-white/30 text-sm hover:text-white/60 transition"
            >
              Scan Another
            </button>
          </div>
        )}
      </div>
    </PageShell>
  );
}
