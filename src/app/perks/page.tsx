import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import PageShell from "@/components/PageShell";
import { MicDoodle, CoffeeDoodle, JointDoodle, LeafDoodle, StarDoodle } from "@/components/Doodles";

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

const leviaPerks = [
  { title: "Founding Member Locker", desc: "Personal wine-locker-style storage on the 2nd floor with curated Levia products." },
  { title: "Monthly Milligram Allotment", desc: "Levia-donated product each month — gummies, pre-rolls, drink drops, and more." },
  { title: "Drink Drops", desc: "Complimentary Levia drink drops at the coffee shop." },
  { title: "Free Levia Water", desc: "Unlimited Levia-infused water on every visit." },
  { title: "Grab-and-Go Levias", desc: "Infused Levia beverages ready when you are." },
  { title: "Coworking Hours", desc: "Included daytime coworking access at the venue." },
  { title: "Earn Show Tickets", desc: "Convert coworking hours into tickets to live shows." },
  { title: "Cold Juice Punch Card", desc: "Loyalty punch card for cold-pressed juices at the workstations." },
  { title: "Dispensary Discounts", desc: "Show your KCB card at 250+ dispensaries for exclusive Levia discounts." },
  { title: "Private Club Access", desc: "Full access to private membership club events and on-site amenities." },
];

export default function PerksPage() {
  return (
    <PageShell>
      <Header />
      <main className="px-6 pt-12 pb-24">
        <div className="max-w-2xl mx-auto relative">
          {/* Doodle art scattered around the page */}
          <div className="absolute -left-4 md:-left-16 top-8 w-12 h-12 md:w-24 md:h-24 text-kc-purple-light pointer-events-none">
            <MicDoodle />
          </div>
          <div className="absolute -right-4 md:-right-16 top-32 w-10 h-10 md:w-20 md:h-20 text-kc-purple-light pointer-events-none rotate-12">
            <CoffeeDoodle />
          </div>
          <div className="absolute -left-3 md:-left-14 top-[45%] w-10 h-10 md:w-20 md:h-20 text-kc-purple-light pointer-events-none -rotate-6">
            <LeafDoodle />
          </div>
          <div className="absolute -right-3 md:-right-14 top-[60%] w-11 h-11 md:w-22 md:h-22 text-kc-purple-light pointer-events-none rotate-3">
            <StarDoodle />
          </div>
          <div className="absolute -right-4 md:-right-12 bottom-20 w-12 h-12 md:w-24 md:h-24 text-kc-purple-light pointer-events-none -rotate-12">
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

          {/* Levia Membership Section */}
          <div className="mt-14">
            <div className="text-center mb-8">
              <Image src="/levia-logo.png" alt="Levia" width={120} height={48} className="mx-auto mb-4 object-contain" />
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">
                Upgrade Your Experience
              </h2>
              <p className="text-white/50 text-sm max-w-md mx-auto font-light">
                Everything in the free tier, plus exclusive Levia-powered perks.
              </p>
            </div>

            <div className="grid gap-3">
              {leviaPerks.map((perk, i) => (
                <div
                  key={i}
                  className="bg-teal-500/[0.03] rounded-2xl p-5 border border-teal-500/10 flex items-start gap-4 hover:border-teal-500/20 hover:bg-teal-500/[0.05] transition"
                >
                  <div className="w-10 h-10 bg-teal-500/10 rounded-xl flex items-center justify-center text-teal-400 shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-white text-sm mb-0.5">{perk.title}</h3>
                    <p className="text-white/40 text-xs leading-relaxed">{perk.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dual CTA */}
          <div className="mt-14 text-center">
            <div className="bg-white/[0.04] rounded-2xl p-10 border border-kc-purple/10">
              <h2 className="text-2xl font-bold text-white mb-2">Ready to join?</h2>
              <p className="text-white/40 mb-6 text-sm">
                Start free or go all in with Levia.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/join"
                  className="inline-block px-8 py-3 bg-white text-black rounded-full font-semibold hover:bg-white/90 transition text-sm btn-glow"
                >
                  Free Membership
                </Link>
                <Link
                  href="/join/levia"
                  className="inline-block px-8 py-3 bg-teal-500 text-white rounded-full font-semibold hover:bg-teal-400 transition text-sm"
                >
                  Levia Membership
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </PageShell>
  );
}
