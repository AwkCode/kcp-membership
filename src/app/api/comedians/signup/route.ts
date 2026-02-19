import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, display_name, city, state, phone, bio, instagram } = body;

    if (!email || !password || !display_name) {
      return NextResponse.json(
        { error: "Email, password, and display name are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const admin = createSupabaseAdmin();

    // Check if comedian with this email already exists
    const { data: existing } = await admin
      .from("comedians")
      .select("id")
      .eq("email", email.trim().toLowerCase())
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // Create Supabase Auth user
    const { data: authData, error: authError } = await admin.auth.admin.createUser({
      email: email.trim().toLowerCase(),
      password,
      email_confirm: true,
      user_metadata: { role: "comedian" },
    });

    if (authError) {
      if (authError.message?.includes("already been registered")) {
        return NextResponse.json(
          { error: "An account with this email already exists" },
          { status: 409 }
        );
      }
      throw authError;
    }

    // Create comedian profile
    const { error: profileError } = await admin
      .from("comedians")
      .insert({
        auth_id: authData.user.id,
        display_name: display_name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone?.trim() || null,
        city: city?.trim() || null,
        state: state?.trim() || null,
        bio: bio?.trim() || "",
        instagram: instagram?.trim() || null,
        status: "pending",
      });

    if (profileError) {
      // Clean up auth user if profile creation fails
      await admin.auth.admin.deleteUser(authData.user.id);
      throw profileError;
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Comedian signup error:", err);
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 }
    );
  }
}
