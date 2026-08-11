import { supabase } from "@/lib/supabase";
import { Database } from "@/lib/supabase/database.types";

export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

export class ProfileRepository {
  async getProfile(userId: string): Promise<ProfileRow | null> {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) return null;
    return data;
  }

  async ensureProfile(userId: string, email: string, fullName?: string): Promise<ProfileRow | null> {
    const existing = await this.getProfile(userId);
    if (existing) return existing;

    const { data, error } = await supabase
      .from("profiles")
      .upsert(
        {
          user_id: userId,
          email: email,
          full_name: fullName || email.split("@")[0],
        },
        { onConflict: "user_id" }
      )
      .select()
      .maybeSingle();

    if (error) {
      console.warn("Could not upsert profile:", error.message);
    }
    return data;
  }
}

export const profileRepository = new ProfileRepository();
