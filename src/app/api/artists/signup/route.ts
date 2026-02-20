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
    const normalizedEmail = email.trim().toLowerCase();

    // Check if artist profile with this email already exists
    const { data: existingArtist } = await admin
      .from("comedians")
      .select("id")
      .eq("email", normalizedEmail)
      .single();

    if (existingArtist) {
      return NextResponse.json(
        { error: "An artist account with this email already exists. Try logging in instead." },
        { status: 409 }
      );
    }

    // Check if there's already a Supabase Auth user with this email
    // (could be a staff user or a member who signed up)
    let authUserId: string;

    const { data: existingUsers } = await admin.auth.admin.listUsers();
    const existingAuth = existingUsers?.users?.find(
      (u: { email?: string }) => u.email?.toLowerCase() === normalizedEmail
    );

    if (existingAuth) {
      // Auth user already exists — link artist profile to existing account
      authUserId = existingAuth.id;
    } else {
      // Create new Supabase Auth user
      const { data: authData, error: authError } = await admin.auth.admin.createUser({
        email: normalizedEmail,
        password,
        email_confirm: true,
        user_metadata: { role: "artist" },
      });

      if (authError) {
        throw authError;
      }

      authUserId = authData.user.id;
    }

    // Create artist profile
    const { error: profileError } = await admin
      .from("comedians")
      .insert({
        auth_id: authUserId,
        display_name: display_name.trim(),
        email: normalizedEmail,
        phone: phone?.trim() || null,
        city: city?.trim() || null,
        state: state?.trim() || null,
        bio: bio?.trim() || "",
        instagram: instagram?.trim() || null,
        status: "pending",
      });

    if (profileError) {
      // Only clean up auth user if we just created it (not if it was existing)
      if (!existingAuth) {
        await admin.auth.admin.deleteUser(authUserId);
      }
      throw profileError;
    }

    return NextResponse.json({ success: true, existingAccount: !!existingAuth });
  } catch (err) {
    console.error("Artist signup error:", err);
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 }
    );
  }
}
