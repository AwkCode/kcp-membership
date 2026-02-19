import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer, createSupabaseAdmin } from "@/lib/supabase/server";
import { generateToken } from "@/lib/token";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
    console.error("Rotate token error:", err);
    return NextResponse.json({ error: "Token rotation failed" }, { status: 500 });
  }
}
