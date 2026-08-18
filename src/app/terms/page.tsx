import Header from "@/components/Header";
import PageShell from "@/components/PageShell";
import { BYLAWS_SECTIONS } from "@/lib/bylaws";

export default function TermsPage() {
  return (
    <PageShell>
      <Header />
      <main className="px-6 pt-24 sm:pt-28 pb-24">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white/[0.04] rounded-2xl border border-kc-purple/10 p-6 sm:p-10">
            <div className="flex items-start justify-between gap-4 mb-8">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white mb-1">
                  Membership By-Laws & Terms of Service
                </h1>
                <p className="text-white/30 text-sm">
                  Kings Court Boston — Private Membership Association
                </p>
              </div>
              <a
                href="/bylaws.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 px-4 py-2 bg-white/[0.06] border border-white/[0.1] rounded-lg text-white/60 text-sm hover:text-white hover:border-white/20 transition flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="hidden sm:inline">Download</span> PDF
              </a>
            </div>

            <article className="text-sm leading-relaxed">
              {BYLAWS_SECTIONS.map((b, i) => {
                if (b.t === "title")
                  return null; // page header already shows the document title
                if (b.t === "meta")
                  return <p key={i} className="text-white/35 text-xs uppercase tracking-wide">{b.s}</p>;
                if (b.t === "part")
                  return <h2 key={i} className="text-kc-purple-light font-bold uppercase tracking-wider text-sm mt-9 mb-3 first:mt-0">{b.s}</h2>;
                if (b.t === "head")
                  return <h3 key={i} className="text-white font-semibold text-[15px] mt-6 mb-1.5">{b.s}</h3>;
                if (b.t === "sub")
                  return <p key={i} className="text-white/70 font-medium mt-3">{b.s}</p>;
                return <p key={i} className="text-white/60 mt-2.5">{b.s}</p>;
              })}
            </article>
          </div>
        </div>
      </main>
    </PageShell>
  );
}
