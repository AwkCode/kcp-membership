/* ── Hand-drawn doodle SVGs for underground / graffiti vibe ── */

export const MicDoodle = () => (
  <svg className="w-full h-full" viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" opacity={0.08}>
    <ellipse cx="40" cy="22" rx="10" ry="16" />
    <line x1="40" y1="38" x2="40" y2="62" />
    <path d="M28 30 Q28 48 40 48 Q52 48 52 30" />
    <line x1="32" y1="62" x2="48" y2="62" />
    <circle cx="40" cy="14" r="2" fill="currentColor" stroke="none" />
    <circle cx="40" cy="20" r="2" fill="currentColor" stroke="none" />
    <circle cx="40" cy="26" r="2" fill="currentColor" stroke="none" />
  </svg>
);

export const CoffeeDoodle = () => (
  <svg className="w-full h-full" viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" opacity={0.08}>
    <path d="M18 30 h36 v0 Q54 62 36 62 Q18 62 18 30Z" />
    <path d="M54 35 Q66 35 66 45 Q66 55 54 55" />
    <path d="M26 18 Q28 10 26 6" />
    <path d="M36 18 Q38 8 36 4" />
    <path d="M46 18 Q48 10 46 6" />
    <line x1="22" y1="68" x2="50" y2="68" />
  </svg>
);

export const JointDoodle = () => (
  <svg className="w-full h-full" viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" opacity={0.08}>
    <line x1="16" y1="60" x2="52" y2="28" />
    <path d="M52 28 L58 22 Q60 20 58 18 L56 20 Q54 22 52 24 L52 28Z" />
    {/* smoke wisps */}
    <path d="M58 18 Q62 12 58 8" />
    <path d="M56 16 Q52 10 56 4" />
    <path d="M60 14 Q64 8 62 2" />
    {/* smiley face */}
    <circle cx="36" cy="46" r="10" />
    <circle cx="33" cy="44" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="39" cy="44" r="1.5" fill="currentColor" stroke="none" />
    <path d="M32 49 Q36 53 40 49" />
  </svg>
);

export const LeafDoodle = () => (
  <svg className="w-full h-full" viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" opacity={0.08}>
    <path d="M40 70 L40 45" />
    <path d="M40 45 Q30 40 22 28 Q32 32 40 30 Q48 32 58 28 Q50 40 40 45Z" />
    <path d="M40 35 Q34 28 28 18 Q36 24 40 22 Q44 24 52 18 Q46 28 40 35Z" />
    <path d="M40 26 Q38 18 36 10 Q40 16 40 16 Q40 16 44 10 Q42 18 40 26Z" />
    <line x1="30" y1="38" x2="22" y2="42" />
    <line x1="50" y1="38" x2="58" y2="42" />
  </svg>
);

export const StarDoodle = () => (
  <svg className="w-full h-full" viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" opacity={0.08}>
    <path d="M40 8 L46 28 L68 28 L50 42 L56 62 L40 50 L24 62 L30 42 L12 28 L34 28Z" />
    <circle cx="40" cy="36" r="4" />
  </svg>
);

export const CrownDoodle = () => (
  <svg className="w-full h-full" viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" opacity={0.08}>
    <path d="M14 55 L14 30 L28 42 L40 20 L52 42 L66 30 L66 55Z" />
    <line x1="14" y1="60" x2="66" y2="60" />
    <circle cx="14" cy="28" r="3" fill="currentColor" stroke="none" />
    <circle cx="40" cy="17" r="3" fill="currentColor" stroke="none" />
    <circle cx="66" cy="28" r="3" fill="currentColor" stroke="none" />
  </svg>
);

export const SpeakerDoodle = () => (
  <svg className="w-full h-full" viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" opacity={0.08}>
    <rect x="16" y="24" width="20" height="32" rx="2" />
    <path d="M36 24 L56 12 L56 68 L36 56Z" />
    <path d="M62 30 Q70 40 62 50" />
    <path d="M66 24 Q78 40 66 56" />
  </svg>
);

/* ── Pre-built doodle layout for pages ── */
interface DoodleScatterProps {
  /** Which set of doodles to show — different pages get different combos */
  variant?: "default" | "home" | "join" | "login";
}

export function DoodleScatter({ variant = "default" }: DoodleScatterProps) {
  if (variant === "home") {
    return (
      <>
        <div className="fixed left-2 md:left-8 top-[18%] w-10 h-10 md:w-16 md:h-16 text-kc-purple-light pointer-events-none z-[2] -rotate-12">
          <MicDoodle />
        </div>
        <div className="fixed right-1 md:right-6 top-[22%] w-9 h-9 md:w-14 md:h-14 text-kc-purple-light pointer-events-none z-[2] rotate-6">
          <CoffeeDoodle />
        </div>
        <div className="fixed left-1 md:left-6 bottom-[20%] w-10 h-10 md:w-16 md:h-16 text-kc-purple-light pointer-events-none z-[2] rotate-3">
          <JointDoodle />
        </div>
        <div className="fixed right-2 md:right-8 bottom-[25%] w-9 h-9 md:w-14 md:h-14 text-kc-purple-light pointer-events-none z-[2] -rotate-8">
          <CrownDoodle />
        </div>
      </>
    );
  }

  if (variant === "join" || variant === "login") {
    return (
      <>
        <div className="fixed left-1 md:left-8 top-[30%] w-10 h-10 md:w-16 md:h-16 text-kc-purple-light pointer-events-none z-[2] rotate-6">
          <CrownDoodle />
        </div>
        <div className="fixed right-1 md:right-8 top-[35%] w-9 h-9 md:w-14 md:h-14 text-kc-purple-light pointer-events-none z-[2] -rotate-12">
          <MicDoodle />
        </div>
        <div className="fixed left-2 md:left-10 bottom-[22%] w-9 h-9 md:w-14 md:h-14 text-kc-purple-light pointer-events-none z-[2] -rotate-3">
          <SpeakerDoodle />
        </div>
      </>
    );
  }

  // default — used on perks and other pages
  return null;
}
