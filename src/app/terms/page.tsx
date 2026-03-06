import Header from "@/components/Header";
import PageShell from "@/components/PageShell";

export default function TermsPage() {
  return (
    <PageShell>
      <Header />
      <main className="px-6 pt-12 pb-24">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/[0.04] rounded-2xl border border-kc-purple/10 p-8">
            <h1 className="text-2xl font-bold text-white mb-2">
              Membership By-Laws & Terms of Service
            </h1>
            <p className="text-white/30 text-sm mb-8">
              Kings Court Boston — Private Membership Association
            </p>

            <div className="space-y-8 text-white/60 text-sm leading-relaxed">
              {/* SECTION 1: MEMBERSHIP BY-LAWS */}
              <div>
                <h2 className="text-white font-bold text-lg mb-4 pb-2 border-b border-white/[0.08]">
                  Part I — Membership By-Laws
                </h2>

                <div className="space-y-6">
                  <section>
                    <h3 className="text-white font-semibold text-base mb-2">
                      1. About Kings Court Boston
                    </h3>
                    <p>
                      Kings Court Boston (&ldquo;Kings Court,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;)
                      is a private membership association operating in Boston, Massachusetts. Kings Court
                      is a cannabis-friendly social club, coffee shop, and creative venue offering curated
                      experiences including comedy shows, art events, and community gatherings in a private,
                      members-only environment. By becoming a member, you agree to abide by these by-laws
                      and all policies set forth by Kings Court management.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-white font-semibold text-base mb-2">
                      2. Membership Eligibility & Age Requirement
                    </h3>
                    <p>
                      All members and guests must be at least <strong className="text-white">21 years of age</strong>.
                      Valid government-issued photo identification is required at the door and may be requested
                      at any time. Misrepresentation of age or identity will result in immediate membership
                      revocation. By signing up, you confirm that you are at least 21 years old and that
                      all information provided is accurate and truthful.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-white font-semibold text-base mb-2">
                      3. Membership Terms & Revocation
                    </h3>
                    <p>
                      Membership is granted at the sole discretion of Kings Court Boston. We reserve the
                      right to deny, suspend, or permanently revoke any membership at any time, for any
                      reason, without prior notice or refund. Membership is non-transferable and is for the
                      named individual only. Members may cancel their membership at any time through their
                      digital member card or by contacting us directly.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-white font-semibold text-base mb-2">
                      4. Member Benefits
                    </h3>
                    <p>
                      Active members in good standing may enjoy benefits including but not limited to:
                    </p>
                    <ul className="list-disc list-inside space-y-1 mt-2">
                      <li>Access to the private Kings Court lounge and event spaces</li>
                      <li>Priority entry and early access to shows and events</li>
                      <li>Access to curated cannabis-friendly social experiences</li>
                      <li>Digital membership card with QR code and mobile wallet pass</li>
                    </ul>
                    <p className="mt-2">
                      Benefits are subject to change and availability. Kings Court reserves the right to
                      modify, add, or remove benefits at any time.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-white font-semibold text-base mb-2">
                      5. Cannabis Consumption Policy
                    </h3>
                    <p>
                      Kings Court Boston is a cannabis-friendly private membership association.
                      Cannabis consumption is permitted only in designated areas within the premises,
                      in accordance with all applicable Massachusetts state laws and local regulations.
                      Members are solely responsible for their own cannabis products and consumption.
                      Kings Court does not sell cannabis.
                    </p>
                    <ul className="list-disc list-inside space-y-1 mt-2">
                      <li>Members must bring their own legally obtained cannabis products</li>
                      <li>Consumption is permitted only in clearly designated areas</li>
                      <li>Members must comply with all Massachusetts Cannabis Control Commission regulations</li>
                      <li>Excessive impairment that disrupts others or poses a safety concern may result in removal</li>
                      <li>Selling cannabis on the premises is strictly prohibited</li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-white font-semibold text-base mb-2">
                      6. No Alcohol Policy
                    </h3>
                    <p>
                      Alcohol is <strong className="text-white">not permitted</strong> on Kings Court
                      premises. Members and guests may not bring, consume, or distribute alcoholic beverages
                      of any kind within the venue. Violation of this policy may result in immediate removal
                      and membership revocation.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-white font-semibold text-base mb-2">
                      7. Guest Policy
                    </h3>
                    <p>
                      Members may bring guests to Kings Court, subject to the following conditions:
                    </p>
                    <ul className="list-disc list-inside space-y-1 mt-2">
                      <li>All guests must be at least 21 years of age and present valid photo ID</li>
                      <li>Members are responsible for the conduct and behavior of their guests at all times</li>
                      <li>Guests must comply with all Kings Court by-laws and policies</li>
                      <li>Kings Court reserves the right to deny entry to any guest at our discretion</li>
                      <li>Guest access may be limited during certain events or at capacity</li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-white font-semibold text-base mb-2">
                      8. Code of Conduct
                    </h3>
                    <p>
                      All members and guests are expected to conduct themselves respectfully and responsibly.
                      The following behaviors are strictly prohibited and may result in immediate removal
                      and permanent membership revocation:
                    </p>
                    <ul className="list-disc list-inside space-y-1 mt-2">
                      <li>Any form of harassment, intimidation, or threatening behavior</li>
                      <li>Discrimination based on race, color, religion, gender, gender identity, sexual orientation, national origin, disability, or any other protected characteristic</li>
                      <li>Physical violence or any conduct that endangers the safety of others</li>
                      <li>Theft, vandalism, or destruction of property</li>
                      <li>Any illegal activity</li>
                      <li>Disruptive behavior that interferes with other members&apos; enjoyment</li>
                      <li>Entering restricted or staff-only areas without authorization</li>
                      <li>Refusal to comply with directions from Kings Court staff</li>
                    </ul>
                    <p className="mt-2">
                      Kings Court staff have full authority to enforce this code of conduct. Their decisions
                      regarding removal or membership revocation are final.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-white font-semibold text-base mb-2">
                      9. Intellectual Property
                    </h3>
                    <p>
                      The Kings Court Boston name, logo, branding, and all associated intellectual property
                      are the exclusive property of Kings Court Boston. Members may not use, reproduce, or
                      distribute any Kings Court trademarks, logos, or proprietary content without prior
                      written approval from management.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-white font-semibold text-base mb-2">
                      10. Assumption of Risk & Liability Waiver
                    </h3>
                    <p>
                      By becoming a member of Kings Court Boston, you acknowledge and voluntarily assume all
                      risks associated with visiting and participating in activities at our venue, including
                      but not limited to exposure to cannabis smoke and consumption environments. To the
                      fullest extent permitted by law, you agree to release, hold harmless, and indemnify
                      Kings Court Boston, its owners, officers, employees, and agents from any and all
                      claims, damages, losses, or liabilities arising from your membership, attendance,
                      or participation in any activities at Kings Court.
                    </p>
                    <p className="mt-2">
                      Kings Court Boston is not responsible for any personal property lost, stolen, or
                      damaged on the premises. Members and guests are solely responsible for their personal
                      belongings at all times.
                    </p>
                  </section>
                </div>
              </div>

              {/* SECTION 2: TERMS OF SERVICE */}
              <div>
                <h2 className="text-white font-bold text-lg mb-4 pb-2 border-b border-white/[0.08]">
                  Part II — Terms of Service & Privacy Policy
                </h2>

                <div className="space-y-6">
                  <section>
                    <h3 className="text-white font-semibold text-base mb-2">
                      11. Information We Collect
                    </h3>
                    <p>
                      When you register for membership, we collect the following information:
                    </p>
                    <ul className="list-disc list-inside space-y-1 mt-2">
                      <li>Full name (first and last)</li>
                      <li>Email address</li>
                      <li>Phone number (optional)</li>
                      <li>ZIP code (optional)</li>
                    </ul>
                    <p className="mt-2">
                      We also automatically record check-in timestamps when you visit and interact with
                      our venue through your membership QR code or digital wallet pass. This data is used
                      solely for membership management purposes.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-white font-semibold text-base mb-2">
                      12. How We Use Your Information
                    </h3>
                    <ul className="list-disc list-inside space-y-1">
                      <li>To create and manage your membership account</li>
                      <li>To provide your digital membership card, QR code, and wallet pass</li>
                      <li>To verify your identity and membership status at check-in</li>
                      <li>To communicate with you about events, updates, and member benefits</li>
                      <li>To improve our services and member experience</li>
                    </ul>
                  </section>

                  <section>
                    <h3 className="text-white font-semibold text-base mb-2">
                      13. Data Protection & Sharing
                    </h3>
                    <p>
                      Your personal information is stored securely and is never sold to third parties.
                      Only authorized Kings Court staff can access member information for the purpose
                      of managing memberships and check-ins. We may use third-party service providers
                      (such as email delivery and hosting services) to operate our platform, and these
                      providers are bound by their own privacy policies. We will not share your personal
                      information with outside parties except as required by law.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-white font-semibold text-base mb-2">
                      14. Communications & Marketing
                    </h3>
                    <p>
                      By providing your email address and/or phone number, you consent to receive
                      membership-related communications from Kings Court Boston, including event
                      announcements, membership updates, and promotional offers. You may opt out of
                      marketing communications at any time by using the unsubscribe link included in
                      our emails, or by contacting us directly. Opting out of marketing communications
                      does not affect essential membership communications.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-white font-semibold text-base mb-2">
                      15. Cancellation & Account Termination
                    </h3>
                    <p>
                      You may cancel your membership at any time through your digital member card page
                      or by contacting us at info@kingscourtboston.com. Upon cancellation, your QR code
                      and digital wallet pass will be deactivated. Kings Court reserves the right to
                      terminate any membership or account at our sole discretion, at any time, without
                      prior notice.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-white font-semibold text-base mb-2">
                      16. Disclaimer of Warranties
                    </h3>
                    <p>
                      All services provided by Kings Court Boston, including the membership platform,
                      digital wallet passes, and website, are provided on an &ldquo;as is&rdquo; and
                      &ldquo;as available&rdquo; basis without warranties of any kind, either express
                      or implied. We do not guarantee uninterrupted access to our services and are not
                      liable for any technical issues, data loss, or service interruptions.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-white font-semibold text-base mb-2">
                      17. Changes to These Terms
                    </h3>
                    <p>
                      Kings Court Boston reserves the right to update or modify these by-laws and terms
                      at any time. Members will be notified of material changes via email. Continued use
                      of your membership after changes have been posted constitutes acceptance of the
                      revised terms.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-white font-semibold text-base mb-2">
                      18. Governing Law
                    </h3>
                    <p>
                      These by-laws and terms shall be governed by and construed in accordance with the
                      laws of the Commonwealth of Massachusetts. Any disputes arising from membership or
                      use of our services shall be resolved in the courts of Suffolk County, Massachusetts.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-white font-semibold text-base mb-2">
                      19. Contact
                    </h3>
                    <p>
                      For questions about your membership, these by-laws, or our privacy practices,
                      contact us at{" "}
                      <a href="mailto:info@kingscourtboston.com" className="text-white underline">
                        info@kingscourtboston.com
                      </a>
                    </p>
                  </section>
                </div>
              </div>

              <p className="text-white/30 text-xs pt-4 border-t border-white/[0.06]">
                Last updated: March 2026
              </p>
            </div>
          </div>
        </div>
      </main>
    </PageShell>
  );
}
