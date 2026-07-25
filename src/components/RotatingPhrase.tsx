"use client";

import { useEffect, useState } from "react";

export default function RotatingPhrase({ phrases }: { phrases: string[] }) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (phrases.length <= 1) return;
    const interval = setInterval(() => {
      setVisible(false);
      const swap = setTimeout(() => {
        setIndex((i) => (i + 1) % phrases.length);
        setVisible(true);
      }, 400);
      return () => clearTimeout(swap);
    }, 2800);
    return () => clearInterval(interval);
  }, [phrases.length]);

  return (
    <div>
      <p
        className={`rj-word-fade text-2xl text-rejesha-cream ${
          visible ? "opacity-100" : "translate-y-2 opacity-0"
        }`}
      >
        {phrases[index]}
      </p>
      {phrases.length > 1 && (
        <div className="mt-4 flex items-center justify-center gap-1.5">
          {phrases.map((phrase, i) => (
            <span
              key={phrase}
              className={`h-1.5 w-1.5 rounded-full transition-colors ${
                i === index ? "bg-rejesha-red" : "bg-rejesha-cream/25"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
