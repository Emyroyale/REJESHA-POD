"use client";

import { useEffect, useRef, useState } from "react";

const MESSAGES = [
  "🚚  Free shipping on orders over $75",
  "🇰🇪  Designed for Kenyans, wherever home is",
  "🌍  Shipped worldwide — Rep Your Roots from anywhere",
  "✨  Custom group shirts — reunions, cruises, graduations",
  "🖨️  Printed in the USA · Made to order",
  "💚  Different Country. Same Heart.",
];

// Duplicate for seamless infinite scroll
const TICKER = [...MESSAGES, ...MESSAGES];

export default function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);
  const [paused, setPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  // Check sessionStorage so it stays dismissed for the session
  useEffect(() => {
    if (sessionStorage.getItem("rj_announcement_dismissed") === "1") {
      setDismissed(true);
    }
  }, []);

  function dismiss() {
    sessionStorage.setItem("rj_announcement_dismissed", "1");
    setDismissed(true);
  }

  if (dismissed) return null;

  return (
    <div
      className="relative z-50 overflow-hidden bg-rejesha-black py-2 text-rejesha-white"
      aria-label="Site announcements"
    >
      <div
        className="flex"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          ref={trackRef}
          className="rj-ticker flex whitespace-nowrap"
          style={{ animationPlayState: paused ? "paused" : "running" }}
          aria-hidden="true"
        >
          {TICKER.map((msg, i) => (
            <span
              key={i}
              className="font-mono-brand mx-8 text-[0.65rem] tracking-[0.2em] uppercase"
            >
              {msg}
              <span className="mx-8 opacity-30">·</span>
            </span>
          ))}
        </div>
      </div>

      {/* Accessible static version for screen readers */}
      <p className="sr-only">{MESSAGES[0]}</p>

      <button
        onClick={dismiss}
        aria-label="Dismiss announcement"
        className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 transition-opacity"
      >
        <svg viewBox="0 0 16 16" className="h-3 w-3" fill="currentColor">
          <path d="M12.7 3.3a1 1 0 0 0-1.4 0L8 6.6 4.7 3.3a1 1 0 0 0-1.4 1.4L6.6 8 3.3 11.3a1 1 0 1 0 1.4 1.4L8 9.4l3.3 3.3a1 1 0 0 0 1.4-1.4L9.4 8l3.3-3.3a1 1 0 0 0 0-1.4Z" />
        </svg>
      </button>
    </div>
  );
}
