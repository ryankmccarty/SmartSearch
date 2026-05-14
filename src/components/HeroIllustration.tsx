import React from 'react';

export function HeroIllustration({ className = '' }: { className?: string }) {
  return (
    <svg
      width="88"
      height="88"
      viewBox="0 0 88 88"
      fill="none"
      aria-hidden="true"
      className={`text-gray-250 ${className}`}
    >
      {/* Chest piece — outer ring */}
      <circle cx="44" cy="66" r="16" stroke="currentColor" strokeWidth="2" />
      {/* Chest piece — inner ring */}
      <circle cx="44" cy="66" r="7" stroke="currentColor" strokeWidth="1.5" />

      {/* Main tube: chest piece up to the Y‑junction */}
      <path
        d="M44 50 L44 30"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      />

      {/* Y‑junction curves to each side */}
      <path
        d="M44 30 C44 20 28 20 28 30"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      />
      <path
        d="M44 30 C44 20 60 20 60 30"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      />

      {/* Left earpiece cap */}
      <path
        d="M28 30 C28 36 22 36 22 30"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      />
      {/* Right earpiece cap */}
      <path
        d="M60 30 C60 36 66 36 66 30"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      />

      {/* Small cross on chest piece — subtle detail */}
      <path
        d="M44 60 L44 72 M38 66 L50 66"
        stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.4"
      />
    </svg>
  );
}
