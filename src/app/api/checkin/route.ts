import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer, createSupabaseAdmin } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { member_id } = await request.json();

    if (!member_id) {
      return NextResponse.json({ error: "member_id is required" }, { status: 400 });
    }

    const admin = createSupabaseAdmin();

    // Verify member exists and is active
    const { data: member } = await admin
      .from("members")
      .select("id, status")
      .eq("id", member_id)
      .single();

    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    if (member.status !== "active") {
      return NextResponse.json(
        { error: `Member is ${member.status}` },
        { status: 403 }
      );
    }

    const { data: checkin, error } = await admin
      .from("checkins")
      .insert({
        member_id,
        checked_in_by: user.id,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ checkin });
  } catch (err) {
    console.error("Checkin error:", err);
    return NextResponse.json({ error: "Failed to check in" }, { status: 500 });
  }
}
