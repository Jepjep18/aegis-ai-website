"use client";

import { useEffect } from "react";

import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/auth.store";
import { profileService } from "@/services/profile/profile.service";

interface Props {
  children: React.ReactNode;
}

export default function AuthProvider({
  children,
}: Props) {
  const {
    setUser,
    setSession,
    setLoading,
    clear,
  } = useAuthStore();

  useEffect(() => {
    let mounted = true;

    async function initialize() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      if (session?.user && session.user.email) {
        profileService.ensureProfile(
          session.user.id,
          session.user.email,
          session.user.user_metadata?.full_name
        );
      }
    }

    initialize();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!mounted) return;

        if (!session) {
          clear();
          return;
        }

        setSession(session);
        setUser(session.user);
        setLoading(false);

        if (session.user && session.user.email) {
          profileService.ensureProfile(
            session.user.id,
            session.user.email,
            session.user.user_metadata?.full_name
          );
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [
    setUser,
    setSession,
    setLoading,
    clear,
  ]);

  return children;
}