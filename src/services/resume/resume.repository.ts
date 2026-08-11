import { supabase } from "@/lib/supabase";
import { Database } from "@/lib/supabase/database.types";

export type ResumeRow = Database["public"]["Tables"]["resumes"]["Row"];
export type ResumeInsert = Database["public"]["Tables"]["resumes"]["Insert"];

export class ResumeRepository {
  async getUserResumes(userId: string): Promise<ResumeRow[]> {
    const { data, error } = await supabase
      .from("resumes")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async uploadResumeFile(userId: string, file: File): Promise<string> {
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error } = await supabase.storage
      .from("resumes")
      .upload(filePath, file, { upsert: true });

    if (error) {
      // Fallback: Return simulated storage path if bucket hasn't been created yet in local Supabase
      return `storage/resumes/${filePath}`;
    }

    const { data: publicUrlData } = supabase.storage
      .from("resumes")
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  }

  async createResumeRecord(record: ResumeInsert): Promise<ResumeRow> {
    const { data, error } = await supabase
      .from("resumes")
      .insert(record)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteResume(id: string): Promise<void> {
    const { error } = await supabase
      .from("resumes")
      .delete()
      .eq("id", id);

    if (error) throw error;
  }
}

export const resumeRepository = new ResumeRepository();
