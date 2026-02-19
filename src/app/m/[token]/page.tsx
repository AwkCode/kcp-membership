import { createSupabaseAdmin } from "@/lib/supabase/server";
import { generateQRDataURL } from "@/lib/qr";
import { notFound } from "next/navigation";
import Image from "next/image";
import Header from "@/components/Header";
import PageShell from "@/components/PageShell";

interface Props {
  params: Promise<{ token: string }>;
}

export default async function MemberCardPage({ params }: Props) {
  const { token } = await params;
  const supabase = createSupabaseAdmin();

  const { data: member } = await supabase
    .from("members")
    .select("first_name, last_name, status, membership_token")
    .eq("membership_token", token)
    .single();

  if (!member) notFound();

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const scanUrl = `${baseUrl}/scan/m/${member.membership_token}`;
  const qrDataUrl = await generateQRDataURL(scanUrl);

  return (
    <PageShell>
      <Header />
      <main className="flex flex-col items-center px-6 pt-12 pb-24">
        <div className="max-w-sm w-full bg-white/[0.06] backdrop-blur-xl rounded-2xl border border-white/[0.06] overflow-hidden">
          <div className="px-6 py-5 text-center border-b border-white/[0.06]">
            <Image src="/kc-logo-v3.png" alt="Kings Court" width={48} height={48} className="mx-auto mb-2 rounded" />
            <h1 className="text-lg font-semibold text-white">Kings Court Boston</h1>
            <p className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5">Member Card</p>
          </div>

          <div className="p-8 text-center">
            <div className="mb-5 bg-white rounded-xl p-4 inline-block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrDataUrl} alt="Membership QR Code" className="w-48 h-48" />
            </div>

            <h2 className="text-2xl font-bold text-white">
              {member.first_name} {member.last_name}
            </h2>

            <span
              className={`inline-block mt-2 px-3 py-1 rounded-full text-[10px] font-medium ${
                member.status === "active"
                  ? "bg-green-500/10 text-green-400 border border-green-500/20"
                  : "bg-red-500/10 text-red-400 border border-red-500/20"
              }`}
            >
              {member.status}
            </span>

            <p className="text-white/30 text-xs mt-6">Show this QR code at check-in</p>
          </div>
        </div>
      </main>
    </PageShell>
  );
}
