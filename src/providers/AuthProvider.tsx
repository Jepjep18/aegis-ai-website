"use client";

import { useEffect } from "react";

import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/auth.store";

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