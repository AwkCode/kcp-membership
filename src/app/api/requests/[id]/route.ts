import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer, createSupabaseAdmin } from "@/lib/supabase/server";
import { sendBookingStatusEmail } from "@/lib/email";

// PATCH: Update request status (staff approve/reject/waitlist, comedian cancel)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const admin = createSupabaseAdmin();
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ error: "status is required" }, { status: 400 });
    }

    const validStatuses = ["requested", "waitlisted", "approved", "rejected", "canceled"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Get the existing request with comedian + show details
    const { data: existing } = await admin
      .from("booking_requests")
      .select("*, comedians:comedian_id(auth_id, email, display_name), shows:show_id(show_name, show_date, start_time)")
      .eq("id", id)
      .single();

    if (!existing) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    // Comedians can only cancel their own requests
    const isOwner = existing.comedians?.auth_id === user.id;
    if (isOwner && status !== "canceled") {
      return NextResponse.json({ error: "You can only cancel your own requests" }, { status: 403 });
    }

    const updates: Record<string, unknown> = { status };
    if (["approved", "rejected", "waitlisted"].includes(status)) {
      updates.reviewed_by = user.id;
      updates.reviewed_at = new Date().toISOString();
    }

    const { data: updated, error } = await admin
      .from("booking_requests")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    // If approved, auto-add to lineup
    if (status === "approved") {
      // Get next slot order
      const { count } = await admin
        .from("show_lineup")
        .select("*", { count: "exact", head: true })
        .eq("show_id", existing.show_id);

      const nextOrder = (count || 0) + 1;

      await admin
        .from("show_lineup")
        .upsert({
          show_id: existing.show_id,
          comedian_id: existing.comedian_id,
          slot_order: nextOrder,
          set_length_minutes: existing.requested_set_length || 10,
          role: "performer",
        }, { onConflict: "show_id,comedian_id" });
    }

    // If rejected or canceled, remove from lineup
    if (status === "rejected" || status === "canceled") {
      await admin
        .from("show_lineup")
        .delete()
        .eq("show_id", existing.show_id)
        .eq("comedian_id", existing.comedian_id);
    }

    // Send booking status email (approved/rejected/waitlisted only, not canceled)
    if (["approved", "rejected", "waitlisted"].includes(status) && existing.comedians?.email) {
      const show = existing.shows as { show_name: string; show_date: string; start_time: string } | null;
      if (show) {
        const formattedDate = new Date(show.show_date + "T00:00:00").toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        });
        sendBookingStatusEmail({
          to: existing.comedians.email,
          comedianName: existing.comedians.display_name || "there",
          showName: show.show_name,
          showDate: formattedDate,
          startTime: show.start_time,
          status: status as "approved" | "rejected" | "waitlisted",
        }).catch((err) => console.error("Booking email failed:", err));
      }
    }

    return NextResponse.json({ request: updated });
  } catch (err) {
    console.error("Update booking request error:", err);
    return NextResponse.json({ error: "Failed to update request" }, { status: 500 });
  }
}
