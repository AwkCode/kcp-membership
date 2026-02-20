import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth";
import { generateToken } from "@/lib/token";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireStaff();

    const { id } = await params;
    const newToken = generateToken();
    const admin = createSupabaseAdmin();

    const { data: member, error } = await admin
      .from("members")
      .update({ membership_token: newToken })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ member });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Token rotation failed";
    const status = message === "Unauthorized" || message === "Staff access required" ? 401 : 500;
    console.error("Rotate token error:", err);
    return NextResponse.json({ error: message }, { status });
  }
}
