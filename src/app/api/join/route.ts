import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/server";
import { generateToken } from "@/lib/token";
import { generateQRDataURL } from "@/lib/qr";
import { sendMembershipEmail } from "@/lib/email";
import { sendMembershipSMS } from "@/lib/sms";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { first_name, last_name, email, phone, tier } = body;

    const normalizedEmail = email?.trim() ? email.trim().toLowerCase() : null;
    const normalizedPhone = phone?.trim() || null;

    if (!first_name || !last_name) {
      return NextResponse.json(
        { error: "First and last name are required" },
        { status: 400 }
      );
    }

    // Members join with a phone or an email (at least one) — no login account.
    if (!normalizedEmail && !normalizedPhone) {
      return NextResponse.json(
        { error: "Enter a phone number or an email so we can send your card" },
        { status: 400 }
      );
    }

    const memberTier = tier || "free";
    if (!["free"].includes(memberTier)) {
      return NextResponse.json(
        { error: "Invalid membership tier" },
        { status: 400 }
      );
    }

    const token = generateToken();
    const supabase = createSupabaseAdmin();

    // Create the member record. Members no longer have login accounts — they
    // receive a membership card (QR + link) by text and/or email.
    const { data: member, error } = await supabase
      .from("members")
      .insert({
        first_name: first_name.trim(),
        last_name: last_name.trim(),
        email: normalizedEmail,
        phone: normalizedPhone,
        membership_token: token,
        status: "active",
        tier: memberTier,
      })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "A member with this email already exists" },
          { status: 409 }
        );
      }
      throw error;
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const scanUrl = `${baseUrl}/scan/m/${token}`;
    const qrDataUrl = await generateQRDataURL(scanUrl);

    // Email the card if an email was provided (non-blocking).
    if (member.email) {
      try {
        await sendMembershipEmail({
          to: member.email,
          firstName: member.first_name,
          lastName: member.last_name,
          token,
          qrImageBase64: qrDataUrl,
          tier: memberTier,
        });
      } catch (emailErr) {
        console.error("Email send failed (non-blocking):", emailErr);
      }
    }

    // Text the card if a phone was provided and Twilio is configured (non-blocking).
    if (member.phone && process.env.TWILIO_ACCOUNT_SID) {
      try {
        await sendMembershipSMS({
          to: member.phone,
          firstName: member.first_name,
          token,
          tier: memberTier,
        });
      } catch (smsErr) {
        console.error("SMS send failed (non-blocking):", smsErr);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Join error:", err);
    return NextResponse.json(
      { error: "Failed to create membership" },
      { status: 500 }
    );
  }
}
