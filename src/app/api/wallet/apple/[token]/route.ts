import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/server";
import { generateApplePass } from "@/lib/wallet/apple";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const supabase = createSupabaseAdmin();

    // Look up the member
    const { data: member, error } = await supabase
      .from("members")
      .select("first_name, last_name, status, membership_token, created_at")
      .eq("membership_token", token)
      .single();

    if (error || !member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    // Only generate passes for active memberships
    const validStatuses = ["active", "vip", "staff", "comp"];
    if (!validStatuses.includes(member.status)) {
      return NextResponse.json(
        { error: "Membership is not active" },
        { status: 403 }
      );
    }

    const passBuffer = await generateApplePass({
      firstName: member.first_name,
      lastName: member.last_name,
      status: member.status,
      token: member.membership_token,
      memberSince: member.created_at,
    });

    return new NextResponse(new Uint8Array(passBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.apple.pkpass",
        "Content-Disposition": `attachment; filename="kings-court-${member.first_name.toLowerCase()}.pkpass"`,
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Apple Wallet pass error:", msg);
    return NextResponse.json(
      { error: "Failed to generate pass", debug: msg },
      { status: 500 }
    );
  }
}
