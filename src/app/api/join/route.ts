import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/server";
import { generateToken } from "@/lib/token";
import { generateQRDataURL } from "@/lib/qr";
import { sendMembershipEmail } from "@/lib/email";
import { sendMembershipSMS } from "@/lib/sms";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { first_name, last_name, email, password, phone } = body;

    if (!first_name || !last_name || !email || !password) {
      return NextResponse.json(
        { error: "First name, last name, email, and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const token = generateToken();
    const supabase = createSupabaseAdmin();
    const normalizedEmail = email.trim().toLowerCase();

    // Check if there's already a Supabase Auth user with this email
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const existingAuth = existingUsers?.users?.find(
      (u: { email?: string }) => u.email?.toLowerCase() === normalizedEmail
    );

    let authUserId: string;
    let createdNewAuth = false;

    if (existingAuth) {
      // Auth user already exists (staff or artist) — link member to existing account
      authUserId = existingAuth.id;
    } else {
      // Create new Supabase Auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: normalizedEmail,
        password,
        email_confirm: true,
        user_metadata: { role: "member" },
      });

      if (authError) {
        throw authError;
      }

      authUserId = authData.user.id;
      createdNewAuth = true;
    }

    // Create member record
    const { data: member, error } = await supabase
      .from("members")
      .insert({
        first_name: first_name.trim(),
        last_name: last_name.trim(),
        email: normalizedEmail,
        phone: phone?.trim() || null,
        membership_token: token,
        status: "active",
        auth_id: authUserId,
      })
      .select()
      .single();

    if (error) {
      // Clean up auth user if we just created it and member insert failed
      if (createdNewAuth) {
        await supabase.auth.admin.deleteUser(authUserId);
      }
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

    await sendMembershipEmail({
      to: member.email,
      firstName: member.first_name,
      lastName: member.last_name,
      token,
      qrImageBase64: qrDataUrl,
    });

    // Send SMS if phone number provided and Twilio is configured
    if (member.phone && process.env.TWILIO_ACCOUNT_SID) {
      try {
        await sendMembershipSMS({
          to: member.phone,
          firstName: member.first_name,
          token,
        });
      } catch (smsErr) {
        console.error("SMS send failed (non-blocking):", smsErr);
        // Don't fail the whole signup if SMS fails
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
