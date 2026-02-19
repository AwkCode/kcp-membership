import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import PageShell from "@/components/PageShell";

export default function Home() {
  return (
    <PageShell>
      <Header />
      <main className="flex flex-col items-center justify-center px-4 sm:px-6 pt-16 sm:pt-20 pb-16 sm:pb-24 min-h-screen">
        <Image
          src="/kc-logo-v3.png"
          alt="Kings Court Boston"
          width={120}
          height={120}
          className="mb-6 sm:mb-8 drop-shadow-2xl w-20 h-20 sm:w-[120px] sm:h-[120px]"
          priority
        />
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-center mb-3 sm:mb-4 text-white tracking-tight">
          Kings Court Boston
        </h1>
        <p className="text-white/60 text-base sm:text-lg text-center mb-8 sm:mb-12 max-w-md font-light px-4">
          Become a member. Skip the line. Unlock exclusive perks.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto px-4 sm:px-0">
          <Link
            href="/join"
            className="px-8 py-3.5 bg-white text-black rounded-full font-semibold hover:bg-white/90 transition text-center shadow-lg text-sm"
          >
            Become a Member
          </Link>
          <Link
            href="/perks"
            className="px-8 py-3.5 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-full font-semibold hover:bg-white/20 transition text-center text-sm"
          >
            View Perks
          </Link>
        </div>

        {/* Staff access — visible but subtle */}
        <div className="mt-8 sm:mt-10 mb-16 sm:mb-24 flex items-center gap-3">
          <span className="text-white/25 text-xs tracking-wide uppercase">Staff</span>
          <div className="w-px h-3 bg-white/15" />
          <div className="flex gap-2">
            <Link
              href="/scan"
              className="px-4 py-1.5 text-white/40 text-xs font-medium hover:text-white/70 transition"
            >
              Scanner
            </Link>
            <Link
              href="/door"
              className="px-4 py-1.5 text-white/40 text-xs font-medium hover:text-white/70 transition"
            >
              Door
            </Link>
            <Link
              href="/admin"
              className="px-4 py-1.5 text-white/40 text-xs font-medium hover:text-white/70 transition"
            >
              Admin
            </Link>
          </div>
        </div>

        {/* Feature cards — Apple style glass */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-3xl w-full px-4 sm:px-0">
          <div className="bg-white/[0.08] backdrop-blur-xl rounded-2xl p-5 sm:p-6 border border-white/[0.08] text-center">
            <div className="w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center mb-3 sm:mb-4 mx-auto">
              <svg className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
            </div>
            <h3 className="font-medium text-white mb-1.5 text-sm">Instant QR Check-In</h3>
            <p className="text-white/40 text-xs leading-relaxed">Show your QR at the door. Walk right in.</p>
          </div>

          <div className="bg-white/[0.08] backdrop-blur-xl rounded-2xl p-5 sm:p-6 border border-white/[0.08] text-center">
            <div className="w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center mb-3 sm:mb-4 mx-auto">
              <svg className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <h3 className="font-medium text-white mb-1.5 text-sm">Exclusive Perks</h3>
            <p className="text-white/40 text-xs leading-relaxed">Discounts, priority seating, members-only events.</p>
          </div>

          <div className="bg-white/[0.08] backdrop-blur-xl rounded-2xl p-5 sm:p-6 border border-white/[0.08] text-center">
            <div className="w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center mb-3 sm:mb-4 mx-auto">
              <svg className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-medium text-white mb-1.5 text-sm">Digital Card</h3>
            <p className="text-white/40 text-xs leading-relaxed">Your membership lives on your phone. Always ready.</p>
          </div>
        </div>
      </main>
    </PageShell>
  );
}
