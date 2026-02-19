import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer, createSupabaseAdmin } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const admin = createSupabaseAdmin();
    const { data: comedian } = await admin
      .from("comedians")
      .select("*")
      .eq("auth_id", user.id)
      .single();

    if (!comedian) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json({ comedian });
  } catch (err) {
    console.error("Get comedian profile error:", err);
    return NextResponse.json({ error: "Failed to load profile" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const admin = createSupabaseAdmin();

    // Get comedian ID
    const { data: comedian } = await admin
      .from("comedians")
      .select("id")
      .eq("auth_id", user.id)
      .single();

    if (!comedian) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const body = await request.json();
    const allowedFields = [
      "display_name", "legal_name", "phone", "city", "state",
      "bio", "instagram", "video_links", "tags"
    ];

    const updates: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    const { data, error } = await admin
      .from("comedians")
      .update(updates)
      .eq("id", comedian.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ comedian: data });
  } catch (err) {
    console.error("Update comedian profile error:", err);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
