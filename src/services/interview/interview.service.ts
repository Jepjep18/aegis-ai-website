import {
  interviewRepository,
  InterviewSessionRow,
  InterviewMessageRow,
} from "./interview.repository";
import { jobDescriptionService } from "@/services/job-description/jd.service";

export interface CreateInterviewParams {
  userId: string;
  companyName: string;
  position: string;
  jobDescription: string;
  resumeId: string;
  aiModel?: string;
  interviewType?: string;
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

    return interviewRepository.createSession({
      user_id: params.userId,
      title,
      resume_id: params.resumeId,
      job_description_id: jdRecord.id,
      status: "Preparing",
      started_at: new Date().toISOString(),
    });
  }

  async getSession(sessionId: string): Promise<InterviewSessionRow | null> {
    return interviewRepository.getSessionById(sessionId);
  }

  async getSessionMessages(sessionId: string): Promise<InterviewMessageRow[]> {
    return interviewRepository.getSessionMessages(sessionId);
  }
}

export const interviewService = new InterviewService();
