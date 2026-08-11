import { supabase } from "@/lib/supabase";
import { Database } from "@/lib/supabase/database.types";

export type InterviewSessionRow = Database["public"]["Tables"]["interview_sessions"]["Row"];
export type InterviewSessionInsert = Database["public"]["Tables"]["interview_sessions"]["Insert"];

export class InterviewRepository {
  async getUserSessions(userId: string): Promise<InterviewSessionRow[]> {
    const { data, error } = await supabase
      .from("interview_sessions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async createSession(record: InterviewSessionInsert): Promise<InterviewSessionRow> {
    const { data, error } = await supabase
      .from("interview_sessions")
      .insert(record)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getSessionById(sessionId: string): Promise<InterviewSessionRow | null> {
    const { data, error } = await supabase
      .from("interview_sessions")
      .select("*")
      .eq("id", sessionId)
      .single();

    if (error) return null;
    return data;
  }
}

export const interviewRepository = new InterviewRepository();
