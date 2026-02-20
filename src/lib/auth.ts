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

export async function requireArtist() {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Look up artist profile linked to this auth user
  const admin = createSupabaseAdmin();
  const { data: artist } = await admin
    .from("comedians")
    .select("*")
    .eq("auth_id", user.id)
    .single();

  if (!artist) {
    throw new Error("Artist profile not found");
  }

  return { user, artist };
}

export async function getAuthUser() {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
