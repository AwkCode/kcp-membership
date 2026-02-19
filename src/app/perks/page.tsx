import Link from "next/link";
import Header from "@/components/Header";
import PageShell from "@/components/PageShell";

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
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Drink Discounts",
    desc: "Members get special pricing on drinks all night long.",
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
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      </svg>
    ),
    title: "Priority Seating",
    desc: "Reserved spots at shows and events. Best seats, guaranteed.",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: "Bring a Friend",
    desc: "Members can bring a guest with the same perks.",
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
];

export default function PerksPage() {
  return (
    <PageShell>
      <Header />
      <main className="px-6 pt-12 pb-24">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">
              Member Perks
            </h1>
            <p className="text-white/50 text-base max-w-md mx-auto font-light">
              Your membership unlocks everything Kings Court has to offer.
            </p>
          </div>

          <div className="grid gap-3">
            {perks.map((perk, i) => (
              <div
                key={i}
                className="bg-white/[0.06] backdrop-blur-xl rounded-2xl p-5 border border-white/[0.06] flex items-start gap-4"
              >
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white/70 shrink-0">
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
            <div className="bg-white/[0.06] backdrop-blur-xl rounded-2xl p-10 border border-white/[0.06]">
              <h2 className="text-2xl font-bold text-white mb-2">Ready to join?</h2>
              <p className="text-white/40 mb-6 text-sm">
                Free membership. Instant access. Takes 30 seconds.
              </p>
              <Link
                href="/join"
                className="inline-block px-8 py-3 bg-white text-black rounded-full font-semibold hover:bg-white/90 transition text-sm"
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
