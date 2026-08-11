import { profileRepository, ProfileRow } from "./profile.repository";

export class ProfileService {
  async ensureProfile(userId: string, email: string, fullName?: string): Promise<ProfileRow | null> {
    return profileRepository.ensureProfile(userId, email, fullName);
  }

  async getProfile(userId: string): Promise<ProfileRow | null> {
    return profileRepository.getProfile(userId);
  }
}

export const profileService = new ProfileService();
