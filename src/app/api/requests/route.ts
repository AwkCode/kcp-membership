import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer, createSupabaseAdmin } from "@/lib/supabase/server";

// POST: Artist requests a spot on a show
export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const admin = createSupabaseAdmin();

    // Get comedian profile
    const { data: comedian } = await admin
      .from("comedians")
      .select("id, status")
      .eq("auth_id", user.id)
      .single();

    if (!comedian) {
      return NextResponse.json({ error: "Artist profile not found" }, { status: 404 });
    }

    if (comedian.status !== "approved") {
      return NextResponse.json(
        { error: "Your account must be approved before requesting spots" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { show_id, requested_set_length, message } = body;

    if (!show_id) {
      return NextResponse.json({ error: "show_id is required" }, { status: 400 });
    }

    // Check show exists and is open
    const { data: show } = await admin
      .from("shows")
      .select("id, status, capacity_slots")
      .eq("id", show_id)
      .single();

    if (!show) {
      return NextResponse.json({ error: "Show not found" }, { status: 404 });
    }

    if (show.status === "canceled") {
      return NextResponse.json({ error: "This show has been canceled" }, { status: 400 });
    }

    if (show.status === "closed") {
      return NextResponse.json({ error: "This show is no longer accepting requests" }, { status: 400 });
    }

    // Check how many approved spots there are
    const { count: approvedCount } = await admin
      .from("booking_requests")
      .select("*", { count: "exact", head: true })
      .eq("show_id", show_id)
      .eq("status", "approved");

    const isFull = (approvedCount || 0) >= show.capacity_slots;

    const { data: bookingRequest, error } = await admin
      .from("booking_requests")
      .insert({
        show_id,
        comedian_id: comedian.id,
        requested_set_length: requested_set_length || null,
        message: message?.trim() || "",
        status: isFull ? "waitlisted" : "requested",
      })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "You already have a request for this show" },
          { status: 409 }
        );
      }
      throw error;
    }

    return NextResponse.json({ request: bookingRequest });
  } catch (err) {
    console.error("Create booking request error:", err);
    return NextResponse.json({ error: "Failed to submit request" }, { status: 500 });
  }
}

// GET: List requests (staff sees all, comedian sees own)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const admin = createSupabaseAdmin();
    const url = new URL(request.url);
    const show_id = url.searchParams.get("show_id");
    const my = url.searchParams.get("my");

    let query = admin
      .from("booking_requests")
      .select(`
        *,
        comedians:comedian_id(id, display_name, email, instagram, city, state, status),
        shows:show_id(id, show_name, show_date, start_time, status)
      `)
      .order("created_at", { ascending: false });

    if (show_id) {
      query = query.eq("show_id", show_id);
    }

    if (my === "true") {
      // Get comedian profile
      const { data: comedian } = await admin
        .from("comedians")
        .select("id")
        .eq("auth_id", user.id)
        .single();

      if (comedian) {
        query = query.eq("comedian_id", comedian.id);
      }
    }

    const { data: requests, error } = await query;
    if (error) throw error;

    return NextResponse.json({ requests });
  } catch (err) {
    console.error("Get booking requests error:", err);
    return NextResponse.json({ error: "Failed to load requests" }, { status: 500 });
  }
}
