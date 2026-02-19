import { createSupabaseAdmin } from "@/lib/supabase/server";
import { generateQRDataURL } from "@/lib/qr";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import PageShell from "@/components/PageShell";
import MemberCard from "./MemberCard";

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
        <MemberCard
          firstName={member.first_name}
          lastName={member.last_name}
          status={member.status}
          token={member.membership_token}
          qrDataUrl={qrDataUrl}
        />
      </main>
    </PageShell>
  );
}
