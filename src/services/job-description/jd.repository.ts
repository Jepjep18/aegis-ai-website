import { supabase } from "@/lib/supabase";
import { Database } from "@/lib/supabase/database.types";

export type JobDescriptionRow = Database["public"]["Tables"]["job_descriptions"]["Row"];
export type JobDescriptionInsert = Database["public"]["Tables"]["job_descriptions"]["Insert"];

export class JobDescriptionRepository {
  async createJobDescription(record: JobDescriptionInsert): Promise<JobDescriptionRow> {
    const { data, error } = await supabase
      .from("job_descriptions")
      .insert(record)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

export const jobDescriptionRepository = new JobDescriptionRepository();
