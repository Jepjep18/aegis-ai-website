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

  async getJobDescriptionById(id: string): Promise<JobDescriptionRow | null> {
    return jobDescriptionRepository.getJobDescriptionById(id);
  }
}

export const jobDescriptionService = new JobDescriptionService();
