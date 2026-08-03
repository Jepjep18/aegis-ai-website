import { supabase } from "@/lib/supabase";

export const authService = {
  signIn: async (
    email: string,
    password: string
  ) => {
    return await supabase.auth.signInWithPassword({
      email,
      password,
    });
  },

  signUp: async (
    email: string,
    password: string
  ) => {
    return await supabase.auth.signUp({
      email,
      password,
    });
  },

  signOut: async () => {
    return await supabase.auth.signOut();
  },

  getUser: async () => {
    return await supabase.auth.getUser();
  },
};