import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer, createSupabaseAdmin } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth";

// GET: List shows (authenticated users — staff or artists)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const admin = createSupabaseAdmin();
    const url = new URL(request.url);
    const upcoming = url.searchParams.get("upcoming");

    let query = admin
      .from("shows")
      .select(`
        *,
        show_lineup(count),
        booking_requests(count)
      `)
      .order("show_date", { ascending: true })
      .order("start_time", { ascending: true });

    if (upcoming === "true") {
      const today = new Date().toISOString().split("T")[0];
      query = query.gte("show_date", today).neq("status", "canceled");
    }

    const { data: shows, error } = await query;
    if (error) throw error;

    return NextResponse.json({ shows });
  } catch (err) {
    console.error("Get shows error:", err);
    return NextResponse.json({ error: "Failed to load shows" }, { status: 500 });
  }
}

// POST: Create show (staff only)
export async function POST(request: NextRequest) {
  try {
    const user = await requireStaff();

    const body = await request.json();
    const { show_name, show_date, start_time, venue, capacity_slots, notes, eventbrite_url } = body;

    if (!show_name || !show_date || !start_time) {
      return NextResponse.json(
        { error: "Show name, date, and start time are required" },
        { status: 400 }
      );
    }

    const admin = createSupabaseAdmin();
    const { data: show, error } = await admin
      .from("shows")
      .insert({
        show_name: show_name.trim(),
        show_date,
        start_time,
        venue: venue?.trim() || "Kings Court Boston",
        capacity_slots: capacity_slots || 8,
        notes: notes?.trim() || "",
        eventbrite_url: eventbrite_url?.trim() || "",
        created_by: user.id,
        status: "scheduled",
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ show });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create show";
    const status = message === "Unauthorized" || message === "Staff access required" ? 401 : 500;
    console.error("Create show error:", err);
    return NextResponse.json({ error: message }, { status });
  }
}

// PATCH: Update show (staff only)
export async function PATCH(request: NextRequest) {
  try {
    await requireStaff();

    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "Show ID is required" }, { status: 400 });
    }

    const admin = createSupabaseAdmin();
    const { data: show, error } = await admin
      .from("shows")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ show });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to update show";
    const status = message === "Unauthorized" || message === "Staff access required" ? 401 : 500;
    console.error("Update show error:", err);
    return NextResponse.json({ error: message }, { status });
  }
}
