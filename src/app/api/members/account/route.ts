import { NextRequest, NextResponse } from "next/server";
import { requireMember } from "@/lib/auth";
import { createSupabaseAdmin } from "@/lib/supabase/server";

export async function GET() {
  try {
    const { member } = await requireMember();

    return NextResponse.json({
      id: member.id,
      first_name: member.first_name,
      last_name: member.last_name,
      email: member.email,
      phone: member.phone,
      status: member.status,
      membership_token: member.membership_token,
      created_at: member.created_at,
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
