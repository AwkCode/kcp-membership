import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer, createSupabaseAdmin } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth";

// GET: Get lineup for a show (authenticated users — staff or comedians)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const admin = createSupabaseAdmin();
    const url = new URL(request.url);
    const show_id = url.searchParams.get("show_id");

    if (!show_id) {
      return NextResponse.json({ error: "show_id is required" }, { status: 400 });
    }

    const { data: lineup, error } = await admin
      .from("show_lineup")
      .select(`
        *,
        comedians:comedian_id(id, display_name, email, instagram, city, state)
      `)
      .eq("show_id", show_id)
      .order("slot_order", { ascending: true });

    if (error) throw error;

    return NextResponse.json({ lineup });
  } catch (err) {
    console.error("Get lineup error:", err);
    return NextResponse.json({ error: "Failed to load lineup" }, { status: 500 });
  }
}

// PATCH: Update lineup (staff only — reorder, change roles, set lengths)
export async function PATCH(request: NextRequest) {
  try {
    await requireStaff();

    const admin = createSupabaseAdmin();
    const body = await request.json();
    const { lineup } = body;

    if (!Array.isArray(lineup)) {
      return NextResponse.json({ error: "lineup array is required" }, { status: 400 });
    }

    // Update each lineup entry
    for (const entry of lineup) {
      const { id, slot_order, set_length_minutes, role, internal_notes } = entry;
      const updates: Record<string, unknown> = {};
      if (slot_order !== undefined) updates.slot_order = slot_order;
      if (set_length_minutes !== undefined) updates.set_length_minutes = set_length_minutes;
      if (role !== undefined) updates.role = role;
      if (internal_notes !== undefined) updates.internal_notes = internal_notes;

      if (Object.keys(updates).length > 0) {
        await admin
          .from("show_lineup")
          .update(updates)
          .eq("id", id);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to update lineup";
    const status = message === "Unauthorized" || message === "Staff access required" ? 401 : 500;
    console.error("Update lineup error:", err);
    return NextResponse.json({ error: message }, { status });
  }
}

// DELETE: Remove from lineup (staff only)
export async function DELETE(request: NextRequest) {
  try {
    await requireStaff();

    const admin = createSupabaseAdmin();
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const { error } = await admin
      .from("show_lineup")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to remove from lineup";
    const status = message === "Unauthorized" || message === "Staff access required" ? 401 : 500;
    console.error("Delete lineup entry error:", err);
    return NextResponse.json({ error: message }, { status });
  }
}
