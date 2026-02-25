import { NextRequest, NextResponse } from "next/server";
import { requireMember } from "@/lib/auth";
import { createSupabaseAdmin } from "@/lib/supabase/server";

export async function GET() {
  try {
    const { member } = await requireMember();
    const admin = createSupabaseAdmin();

    // Get visit count
    const { count: visitCount } = await admin
      .from("checkins")
      .select("*", { count: "exact", head: true })
      .eq("member_id", member.id);

    // Get last check-in
    const { data: lastCheckin } = await admin
      .from("checkins")
      .select("created_at")
      .eq("member_id", member.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    // Get upcoming shows
    const today = new Date().toISOString().split("T")[0];
    const { data: upcomingShows } = await admin
      .from("shows")
      .select("id, show_name, show_date, start_time, venue, eventbrite_url")
      .gte("show_date", today)
      .eq("status", "scheduled")
      .order("show_date", { ascending: true })
      .order("start_time", { ascending: true })
      .limit(5);

    return NextResponse.json({
      id: member.id,
      first_name: member.first_name,
      last_name: member.last_name,
      email: member.email,
      phone: member.phone,
      status: member.status,
      membership_token: member.membership_token,
      created_at: member.created_at,
      visit_count: visitCount || 0,
      last_checkin: lastCheckin?.created_at || null,
      upcoming_shows: upcomingShows || [],
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unauthorized";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { member } = await requireMember();
    const body = await request.json();

    const updates: Record<string, string> = {};

    if (body.first_name !== undefined) {
      const trimmed = body.first_name.trim();
      if (!trimmed) {
        return NextResponse.json({ error: "First name is required" }, { status: 400 });
      }
      updates.first_name = trimmed;
    }

    if (body.last_name !== undefined) {
      const trimmed = body.last_name.trim();
      if (!trimmed) {
        return NextResponse.json({ error: "Last name is required" }, { status: 400 });
      }
      updates.last_name = trimmed;
    }

    if (body.phone !== undefined) {
      updates.phone = body.phone.trim() || null as unknown as string;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    const admin = createSupabaseAdmin();
    const { data, error } = await admin
      .from("members")
      .update(updates)
      .eq("id", member.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      id: data.id,
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      phone: data.phone,
      status: data.status,
      membership_token: data.membership_token,
      created_at: data.created_at,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to update";
    const status = message === "Unauthorized" || message === "Member profile not found" ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
