import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const user = await requireStaff();

    const { member_id, notes } = await request.json();

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

    const validStatuses = ["active", "vip", "staff", "comp"];
    if (!validStatuses.includes(member.status)) {
      return NextResponse.json(
        { error: `Member is ${member.status}` },
        { status: 403 }
      );
    }

    const insertData: Record<string, string> = {
      member_id,
      checked_in_by: user.id,
    };
    if (notes) insertData.notes = notes;

    const { data: checkin, error } = await admin
      .from("checkins")
      .insert(insertData)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ checkin });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to check in";
    const status = message === "Unauthorized" || message === "Staff access required" ? 401 : 500;
    console.error("Checkin error:", err);
    return NextResponse.json({ error: message }, { status });
  }
}
