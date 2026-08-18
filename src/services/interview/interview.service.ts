import {
  interviewRepository,
  InterviewSessionRow,
  InterviewMessageRow,
  InterviewMessageInsert,
} from "./interview.repository";
import { jobDescriptionService } from "@/services/job-description/jd.service";
import { getSessionDurationMinutes, Plan } from "@/lib/config/interview.config";

export interface CreateInterviewParams {
  userId: string;
  companyName: string;
  position: string;
  jobDescription: string;
  resumeId: string;
  aiModel?: string;
  interviewType?: string;
  plan?: Plan;
}

export class InterviewService {
  async getSessions(userId: string): Promise<InterviewSessionRow[]> {
    return interviewRepository.getUserSessions(userId);
  }

  async createSession(params: CreateInterviewParams): Promise<InterviewSessionRow> {
    const jdRecord = await jobDescriptionService.saveJobDescription(
      params.userId,
      params.jobDescription,
      params.companyName,
      params.position
    );

    const title = `${params.position} at ${params.companyName}`;
    const durationMinutes = getSessionDurationMinutes(params.plan);

    return interviewRepository.createSession({
      user_id: params.userId,
      title,
      resume_id: params.resumeId,
      job_description_id: jdRecord.id,
      status: "Preparing",
      started_at: new Date().toISOString(),
      duration_minutes: durationMinutes,
    });
  }

  async getSession(sessionId: string): Promise<InterviewSessionRow | null> {
    return interviewRepository.getSessionById(sessionId);
  }

  async getSessionMessages(sessionId: string): Promise<InterviewMessageRow[]> {
    return interviewRepository.getSessionMessages(sessionId);
  }

  async activateSession(sessionId: string): Promise<InterviewSessionRow | null> {
    return interviewRepository.updateSession(sessionId, { status: "Active" });
  }

  async completeSession(sessionId: string): Promise<InterviewSessionRow | null> {
    return interviewRepository.updateSession(sessionId, {
      status: "Completed",
      ended_at: new Date().toISOString(),
    });
  }

  async saveMessage(record: InterviewMessageInsert): Promise<InterviewMessageRow> {
    return interviewRepository.saveMessage(record);
  }
}

export const interviewService = new InterviewService();
