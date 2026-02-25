import Link from "next/link";
import Header from "@/components/Header";
import PageShell from "@/components/PageShell";

/* ── Doodle SVGs ── */
const MicDoodle = () => (
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

const CoffeeDoodle = () => (
  <svg className="w-full h-full" viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" opacity={0.08}>
    <path d="M18 30 h36 v0 Q54 62 36 62 Q18 62 18 30Z" />
    <path d="M54 35 Q66 35 66 45 Q66 55 54 55" />
    <path d="M26 18 Q28 10 26 6" />
    <path d="M36 18 Q38 8 36 4" />
    <path d="M46 18 Q48 10 46 6" />
    <line x1="22" y1="68" x2="50" y2="68" />
  </svg>
);

const JointDoodle = () => (
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

const LeafDoodle = () => (
  <svg className="w-full h-full" viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" opacity={0.08}>
    {/* cannabis leaf - simplified doodle */}
    <path d="M40 70 L40 45" />
    <path d="M40 45 Q30 40 22 28 Q32 32 40 30 Q48 32 58 28 Q50 40 40 45Z" />
    <path d="M40 35 Q34 28 28 18 Q36 24 40 22 Q44 24 52 18 Q46 28 40 35Z" />
    <path d="M40 26 Q38 18 36 10 Q40 16 40 16 Q40 16 44 10 Q42 18 40 26Z" />
    <line x1="30" y1="38" x2="22" y2="42" />
    <line x1="50" y1="38" x2="58" y2="42" />
  </svg>
);

const StarDoodle = () => (
  <svg className="w-full h-full" viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" opacity={0.08}>
    <path d="M40 8 L46 28 L68 28 L50 42 L56 62 L40 50 L24 62 L30 42 L12 28 L34 28Z" />
    <circle cx="40" cy="36" r="4" />
  </svg>
);

const perks = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
      </svg>
    ),
    title: "Skip the Line",
    desc: "Flash your QR code at the door and walk right in.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    title: "Members-Only Events",
    desc: "First access to secret shows, private parties, and special nights.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    title: "Digital Membership Card",
    desc: "Your card lives on your phone. No plastic, no hassle.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    title: "Daily Coffee Bar",
    desc: "Grab a coffee every day. Members get discounted drinks from our in-house bar.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" />
      </svg>
    ),
    title: "420-Friendly Lounge",
    desc: "Light up and chill. Our space is weed-friendly — bring your own or grab from the menu.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Open Daily",
    desc: "Coffee shop by day, creative venue by night. Members get access to it all.",
  },
];

export default function PerksPage() {
  return (
    <PageShell>
      <Header />
      <main className="px-6 pt-12 pb-24">
        <div className="max-w-2xl mx-auto relative">
          {/* Doodle art scattered around the page */}
          <div className="absolute -left-16 top-8 w-24 h-24 text-kc-purple-light pointer-events-none hidden md:block">
            <MicDoodle />
          </div>
          <div className="absolute -right-16 top-32 w-20 h-20 text-kc-purple-light pointer-events-none hidden md:block rotate-12">
            <CoffeeDoodle />
          </div>
          <div className="absolute -left-14 top-[45%] w-20 h-20 text-kc-purple-light pointer-events-none hidden md:block -rotate-6">
            <LeafDoodle />
          </div>
          <div className="absolute -right-14 top-[60%] w-22 h-22 text-kc-purple-light pointer-events-none hidden md:block rotate-3">
            <StarDoodle />
          </div>
          <div className="absolute -right-12 bottom-20 w-24 h-24 text-kc-purple-light pointer-events-none hidden md:block -rotate-12">
            <JointDoodle />
          </div>

          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">
              Member Perks
            </h1>
            <p className="text-white/50 text-base max-w-md mx-auto font-light">
              Coffee shop by day. Creative venue by night. 420-friendly always.
            </p>
          </div>

          <div className="grid gap-3">
            {perks.map((perk, i) => (
              <div
                key={i}
                className="bg-white/[0.04] rounded-2xl p-5 border border-kc-purple/10 flex items-start gap-4 hover:border-kc-purple/20 hover:bg-kc-purple/[0.04] transition"
              >
                <div className="w-10 h-10 bg-kc-purple/10 rounded-xl flex items-center justify-center text-kc-purple-light shrink-0">
                  {perk.icon}
                </div>
                <div>
                  <h3 className="font-medium text-white text-sm mb-0.5">{perk.title}</h3>
                  <p className="text-white/40 text-xs leading-relaxed">{perk.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14 text-center">
            <div className="bg-white/[0.04] rounded-2xl p-10 border border-kc-purple/10">
              <h2 className="text-2xl font-bold text-white mb-2">Ready to join?</h2>
              <p className="text-white/40 mb-6 text-sm">
                Free membership. Instant access. Takes 30 seconds.
              </p>
              <Link
                href="/join"
                className="inline-block px-8 py-3 bg-white text-black rounded-full font-semibold hover:bg-white/90 transition text-sm btn-glow"
              >
                Become a Member
              </Link>
            </div>
          </div>
        </div>
      </main>
    </PageShell>
  );
}
