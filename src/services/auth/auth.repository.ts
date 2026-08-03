import { supabase } from "@/lib/supabase";

export interface SignUpDto {
  email: string;
  password: string;
}

export interface SignInDto {
  email: string;
  password: string;
}

export class AuthRepository {
  async signUp({ email, password }: SignUpDto) {
    return await supabase.auth.signUp({
      email,
      password,
    });
  }

  async signIn({ email, password }: SignInDto) {
    return await supabase.auth.signInWithPassword({
      email,
      password,
    });
  }

  async signOut() {
    return await supabase.auth.signOut();
  }

  async getSession() {
    return await supabase.auth.getSession();
  }

  async getUser() {
    return await supabase.auth.getUser();
  }

  async resetPassword(email: string) {
    return await supabase.auth.resetPasswordForEmail(email);
  }
}

export const authRepository = new AuthRepository();