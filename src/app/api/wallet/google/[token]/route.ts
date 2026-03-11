import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/server";
import { generateGoogleWalletUrl } from "@/lib/wallet/google";

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
      .select("first_name, last_name, status, tier, membership_token, created_at")
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

    const saveUrl = generateGoogleWalletUrl({
      firstName: member.first_name,
      lastName: member.last_name,
      status: member.status,
      tier: member.tier,
      token: member.membership_token,
      memberSince: member.created_at,
    });

    // Redirect to the Google Wallet save URL
    return NextResponse.redirect(saveUrl);
  } catch (err) {
    console.error("Google Wallet pass error:", err);
    return NextResponse.json(
      { error: "Failed to generate pass" },
      { status: 500 }
    );
  }
}
