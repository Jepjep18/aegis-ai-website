import { supabase } from "@/lib/supabase";
import { Database } from "@/lib/supabase/database.types";

export type InterviewSessionRow = Database["public"]["Tables"]["interview_sessions"]["Row"];
export type InterviewSessionInsert = Database["public"]["Tables"]["interview_sessions"]["Insert"];
export type InterviewSessionUpdate = Database["public"]["Tables"]["interview_sessions"]["Update"];
export type InterviewMessageRow = Database["public"]["Tables"]["interview_messages"]["Row"];
export type InterviewMessageInsert = Database["public"]["Tables"]["interview_messages"]["Insert"];

export class InterviewRepository {
  async getSessionMessages(sessionId: string): Promise<InterviewMessageRow[]> {
    const { data, error } = await supabase
      .from("interview_messages")
      .select("*")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data || [];
  }

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

  async updateSession(
    sessionId: string,
    patch: InterviewSessionUpdate
  ): Promise<InterviewSessionRow | null> {
    const { data, error } = await supabase
      .from("interview_sessions")
      .update({ ...patch, updated_at: new Date().toISOString() })
      .eq("id", sessionId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async saveMessage(record: InterviewMessageInsert): Promise<InterviewMessageRow> {
    const { data, error } = await supabase
      .from("interview_messages")
      .insert(record)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

export const interviewRepository = new InterviewRepository();
