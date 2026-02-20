import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireStaff();

    const { id } = await params;
    const body = await request.json();
    const { status, notes } = body;

    const updates: Record<string, string> = {};
    if (status && ["active", "suspended", "cancelled"].includes(status)) {
      updates.status = status;
    }
    if (notes !== undefined) {
      updates.notes = notes;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    const admin = createSupabaseAdmin();
    const { data: member, error } = await admin
      .from("members")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ member });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Update failed";
    const status = message === "Unauthorized" || message === "Staff access required" ? 401 : 500;
    console.error("Update member error:", err);
    return NextResponse.json({ error: message }, { status });
  }
}
