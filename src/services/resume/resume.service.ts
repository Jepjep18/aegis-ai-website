import { resumeRepository, ResumeRow } from "./resume.repository";

export class ResumeService {
  async getResumes(userId: string): Promise<ResumeRow[]> {
    return resumeRepository.getUserResumes(userId);
  }

  async uploadResume(
    userId: string,
    file: File,
    title: string
  ): Promise<ResumeRow> {
    const fileUrl = await resumeRepository.uploadResumeFile(userId, file);

    return resumeRepository.createResumeRecord({
      user_id: userId,
      title: title || file.name,
      file_name: file.name,
      file_url: fileUrl,
      file_size: file.size,
      status: "ready",
    });
  }

  async deleteResume(id: string): Promise<void> {
    return resumeRepository.deleteResume(id);
  }
}

export const resumeService = new ResumeService();
