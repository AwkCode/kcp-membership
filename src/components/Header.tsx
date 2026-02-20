"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  const [loginOpen, setLoginOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setLoginOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="w-full absolute top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 sm:gap-3">
          <Image
            src="/kc-logo-v3.png"
            alt="Kings Court"
            width={36}
            height={36}
            className="rounded-lg brightness-110 sm:w-10 sm:h-10"
          />
          <span className="text-sm sm:text-base font-semibold tracking-tight text-white">
            Kings Court Boston
          </span>
        </Link>
        <nav className="flex items-center gap-4 sm:gap-6 text-sm font-medium text-white/70">
          <Link href="/join" className="hover:text-white transition">
            Join
          </Link>
          <Link href="/perks" className="hover:text-white transition">
            Perks
          </Link>
          <Link href="/terms" className="hover:text-white transition hidden sm:block">
            Terms
          </Link>
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setLoginOpen(!loginOpen)}
              className="hover:text-white transition"
            >
              Login
            </button>
            {loginOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-black/95 border border-white/10 rounded-lg shadow-xl overflow-hidden">
                <Link
                  href="/login"
                  className="block px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/[0.06] transition"
                  onClick={() => setLoginOpen(false)}
                >
                  Staff
                </Link>
                <Link
                  href="/artists/login"
                  className="block px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/[0.06] transition"
                  onClick={() => setLoginOpen(false)}
                >
                  Artist
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
