import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/server";
import { generateQRDataURL } from "@/lib/qr";
import { sendMembershipEmail } from "@/lib/email";
import { sendMembershipSMS } from "@/lib/sms";

interface MemberRow {
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  membership_token: string;
  tier: string | null;
}

// Last 10 digits, so formatting differences ((555) 123-4567 vs 5551234567) match.
const digits = (p?: string | null) => (p || "").replace(/\D/g, "").slice(-10);

export async function POST(request: NextRequest) {
  try {
    const { email, phone } = await request.json();
    const normalizedEmail = email?.trim() ? email.trim().toLowerCase() : null;
    const phoneDigits = phone?.trim() ? digits(phone) : null;

    if (!normalizedEmail && !phoneDigits) {
      return NextResponse.json(
        { error: "Enter the phone number or email you signed up with" },
        { status: 400 }
      );
    }

    const supabase = createSupabaseAdmin();
    let member: MemberRow | null = null;

    // Email is stored lowercased at signup — exact match is reliable.
    if (normalizedEmail) {
      const { data } = await supabase
        .from("members")
        .select("first_name, last_name, email, phone, membership_token, tier")
        .eq("email", normalizedEmail)
        .maybeSingle();
      member = (data as MemberRow) || null;
    }

    // Phone match tolerates formatting differences by comparing digits.
    if (!member && phoneDigits && phoneDigits.length >= 10) {
      const { data: rows } = await supabase
        .from("members")
        .select("first_name, last_name, email, phone, membership_token, tier")
        .not("phone", "is", null);
      member =
        ((rows as MemberRow[]) || []).find((m) => digits(m.phone) === phoneDigits) || null;
    }

    if (!member) {
      return NextResponse.json(
        { error: "We couldn't find a membership with that phone or email." },
        { status: 404 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const scanUrl = `${baseUrl}/scan/m/${member.membership_token}`;
    const qrDataUrl = await generateQRDataURL(scanUrl);

    // Re-send the card to whatever contacts are on file (non-blocking).
    if (member.email) {
      try {
        await sendMembershipEmail({
          to: member.email,
          firstName: member.first_name,
          lastName: member.last_name,
          token: member.membership_token,
          qrImageBase64: qrDataUrl,
          tier: member.tier || "free",
        });
      } catch (e) {
        console.error("Card resend email failed:", e);
      }
    }
    if (member.phone && process.env.TWILIO_ACCOUNT_SID) {
      try {
        await sendMembershipSMS({
          to: member.phone,
          firstName: member.first_name,
          token: member.membership_token,
          tier: member.tier || "free",
        });
      } catch (e) {
        console.error("Card resend SMS failed:", e);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Card resend error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
