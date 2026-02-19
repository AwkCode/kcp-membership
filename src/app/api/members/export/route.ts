import { NextResponse } from "next/server";
import { createSupabaseServer, createSupabaseAdmin } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = createSupabaseAdmin();
    const { data: members, error } = await admin
      .from("members")
      .select("first_name, last_name, email, phone, status, notes, created_at")
      .order("created_at", { ascending: false });

    if (error) throw error;

    const header = "First Name,Last Name,Email,Phone,Status,Notes,Joined";
    const rows = (members || []).map((m: { first_name: string; last_name: string; email: string; phone: string | null; status: string; notes: string | null; created_at: string }) => {
      const escape = (v: string | null) => {
        if (!v) return "";
        if (v.includes(",") || v.includes('"') || v.includes("\n")) {
          return `"${v.replace(/"/g, '""')}"`;
        }
        return v;
      };
      return [
        escape(m.first_name),
        escape(m.last_name),
        escape(m.email),
        escape(m.phone),
        escape(m.status),
        escape(m.notes),
        new Date(m.created_at).toLocaleDateString(),
      ].join(",");
    });

    const csv = [header, ...rows].join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="kc-members-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch (err) {
    console.error("Export error:", err);
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
