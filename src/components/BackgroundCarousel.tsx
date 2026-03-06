"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const images = [
  "/carousel/2.jpg",
  "/carousel/3.jpg",
  "/carousel/4.jpg",
  "/carousel/5.jpg",
  "/carousel/6.jpg",
  "/carousel/7.jpg",
  "/carousel/8.jpg",
];

const INTERVAL = 6000; // 6 seconds per slide

export default function BackgroundCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, INTERVAL);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* All images stacked — only the active one is visible */}
      {images.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 scale-105"
          style={{
            opacity: i === activeIndex ? 1 : 0,
            transition: "opacity 1.5s ease-in-out",
          }}
        >
          <Image
            src={src}
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
            priority={i === 0}
            aria-hidden="true"
          />
        </div>
      ))}

      {/* Dark gradient overlay — keeps text readable */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/35 to-black/60" />

      {/* Purple tint overlay — maintains the KC brand feel */}
      <div className="absolute inset-0 bg-[#110022]/30 mix-blend-multiply" />

      {/* Subtle vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.35) 100%)",
        }}
      />
    </div>
  );
}
