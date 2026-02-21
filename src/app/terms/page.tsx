import Header from "@/components/Header";
import PageShell from "@/components/PageShell";

export default function TermsPage() {
  return (
    <PageShell>
      <Header />
      <main className="px-6 pt-12 pb-24">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/[0.04] rounded-2xl border border-kc-purple/10 p-8">
            <h1 className="text-2xl font-bold text-white mb-6">Terms of Service & Privacy Policy</h1>

            <div className="space-y-6 text-white/60 text-sm leading-relaxed">
              <section>
                <h2 className="text-white font-semibold text-base mb-2">Membership</h2>
                <p>
                  By signing up for a Kings Court Boston membership, you agree to provide accurate
                  contact information. Your membership grants you access to member benefits including
                  priority entry, drink discounts, and members-only events as available. Kings Court
                  Boston reserves the right to suspend or cancel any membership at any time.
                </p>
              </section>

              <section>
                <h2 className="text-white font-semibold text-base mb-2">Information We Collect</h2>
                <p>
                  We collect your name, email address, and optionally your phone number when you
                  sign up. We also record check-in timestamps when you visit. This information is
                  used solely for managing your membership and communicating with you about
                  Kings Court events and updates.
                </p>
              </section>

              <section>
                <h2 className="text-white font-semibold text-base mb-2">How We Use Your Information</h2>
                <ul className="list-disc list-inside space-y-1">
                  <li>To send you your membership QR code and digital card</li>
                  <li>To verify your membership at check-in</li>
                  <li>To send you updates about events and member benefits</li>
                  <li>To send you a text message with your card link (if you provide a phone number)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-white font-semibold text-base mb-2">Data Protection</h2>
                <p>
                  Your personal information is stored securely and is never sold to third parties.
                  Only authorized Kings Court staff can access member information for the purpose
                  of managing memberships and check-ins.
                </p>
              </section>

              <section>
                <h2 className="text-white font-semibold text-base mb-2">Cancellation</h2>
                <p>
                  You may cancel your membership at any time from your digital member card page.
                  Upon cancellation, your QR code will be deactivated. You may re-register at
                  any time to receive a new membership.
                </p>
              </section>

              <section>
                <h2 className="text-white font-semibold text-base mb-2">Communications</h2>
                <p>
                  By providing your email, you consent to receive membership-related communications
                  from Kings Court Boston. You can cancel your membership at any time to stop
                  receiving communications.
                </p>
              </section>

              <section>
                <h2 className="text-white font-semibold text-base mb-2">Contact</h2>
                <p>
                  For questions about your membership or this policy, contact us at{" "}
                  <a href="mailto:info@kingscourtboston.com" className="text-white underline">
                    info@kingscourtboston.com
                  </a>
                </p>
              </section>

              <p className="text-white/30 text-xs pt-4 border-t border-white/[0.06]">
                Last updated: February 2026
              </p>
            </div>
          </div>
        </div>
      </main>
    </PageShell>
  );
}
