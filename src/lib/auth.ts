import { createSupabaseServer, createSupabaseAdmin } from "@/lib/supabase/server";

export async function requireStaff() {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const role = user.user_metadata?.role;
  if (role !== "staff" && role !== "admin") {
    throw new Error("Staff access required");
  }

  return user;
}

export async function requireComedian() {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Look up comedian profile linked to this auth user
  const admin = createSupabaseAdmin();
  const { data: comedian } = await admin
    .from("comedians")
    .select("*")
    .eq("auth_id", user.id)
    .single();

  if (!comedian) {
    throw new Error("Comedian profile not found");
  }

  return { user, comedian };
}

export async function getAuthUser() {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
