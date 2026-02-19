import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer, createSupabaseAdmin } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    // Verify staff auth
    const supabase = await createSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { token } = await params;
    const admin = createSupabaseAdmin();

    // Get member
    const { data: member, error: memberError } = await admin
      .from("members")
      .select("id, first_name, last_name, status, notes, created_at")
      .eq("membership_token", token)
      .single();

    if (memberError || !member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    // Get last check-in
    const { data: lastCheckin } = await admin
      .from("checkins")
      .select("created_at")
      .eq("member_id", member.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    return NextResponse.json({
      member: {
        id: member.id,
        first_name: member.first_name,
        last_name: member.last_name,
        status: member.status,
        notes: member.notes,
        created_at: member.created_at,
        last_checkin: lastCheckin?.created_at || null,
      },
    });
  } catch (err) {
    console.error("Scan error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
