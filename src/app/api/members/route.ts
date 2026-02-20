import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth";

export async function GET() {
  try {
    await requireStaff();

    const admin = createSupabaseAdmin();
    const { data: members, error } = await admin
      .from("members")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ members });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load members";
    const status = message === "Unauthorized" || message === "Staff access required" ? 401 : 500;
    console.error("Members list error:", err);
    return NextResponse.json({ error: message }, { status });
  }
}
