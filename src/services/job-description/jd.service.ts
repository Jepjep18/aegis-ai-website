import { jobDescriptionRepository, JobDescriptionRow } from "./jd.repository";

export class JobDescriptionService {
  async saveJobDescription(
    userId: string,
    content: string,
    companyName?: string,
    position?: string
  ): Promise<JobDescriptionRow> {
    return jobDescriptionRepository.createJobDescription({
      user_id: userId,
      content,
      company_name: companyName || null,
      position: position || null,
    });
  }
}

export const jobDescriptionService = new JobDescriptionService();
