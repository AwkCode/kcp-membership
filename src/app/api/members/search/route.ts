import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer, createSupabaseAdmin } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const q = request.nextUrl.searchParams.get("q")?.trim();
    if (!q || q.length < 2) {
      return NextResponse.json({ members: [] });
    }

    const admin = createSupabaseAdmin();
    const pattern = `%${q}%`;

    const { data: members, error } = await admin
      .from("members")
      .select("id, first_name, last_name, email, phone, status")
      .or(
        `first_name.ilike.${pattern},last_name.ilike.${pattern},email.ilike.${pattern},phone.ilike.${pattern}`
      )
      .order("last_name")
      .limit(20);

    if (error) throw error;

    // Get last check-in for each member
    const memberIds = members.map((m: { id: string }) => m.id);
    const { data: checkins } = await admin
      .from("checkins")
      .select("member_id, created_at")
      .in("member_id", memberIds.length > 0 ? memberIds : ["none"])
      .order("created_at", { ascending: false });

    const lastCheckinMap = new Map<string, string>();
    for (const c of checkins || []) {
      if (!lastCheckinMap.has(c.member_id)) {
        lastCheckinMap.set(c.member_id, c.created_at);
      }
    }

    const enriched = members.map((m: { id: string; first_name: string; last_name: string; email: string; phone: string | null; status: string }) => ({
      ...m,
      last_checkin: lastCheckinMap.get(m.id) || null,
    }));

    return NextResponse.json({ members: enriched });
  } catch (err) {
    console.error("Search error:", err);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
