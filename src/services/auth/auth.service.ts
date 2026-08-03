import {
  authRepository,
  SignInDto,
  SignUpDto,
} from "./auth.repository";

class AuthService {
  async signUp(data: SignUpDto) {
    const email = data.email.trim().toLowerCase();

    return authRepository.signUp({
      ...data,
      email,
    });
  }

  async signIn(data: SignInDto) {
    const email = data.email.trim().toLowerCase();

    return authRepository.signIn({
      ...data,
      email,
    });
  }

  async signOut() {
    return authRepository.signOut();
  }

  async getSession() {
    return authRepository.getSession();
  }

  async getUser() {
    return authRepository.getUser();
  }

  async resetPassword(email: string) {
    return authRepository.resetPassword(email);
  }
}

export const authService = new AuthService();