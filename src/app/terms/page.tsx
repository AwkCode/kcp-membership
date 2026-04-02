import Header from "@/components/Header";
import PageShell from "@/components/PageShell";

export default function TermsPage() {
  return (
    <PageShell>
      <Header />
      <main className="px-6 pt-12 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/[0.04] rounded-2xl border border-kc-purple/10 p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">
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
                Download PDF
              </a>
            </div>

            <div className="rounded-xl overflow-hidden border border-white/[0.06]">
              <iframe
                src="/bylaws.pdf"
                className="w-full bg-white"
                style={{ height: "80vh" }}
                title="Kings Court Boston — Membership By-Laws & Terms of Service"
              />
            </div>
          </div>
        </div>
      </main>
    </PageShell>
  );
}
