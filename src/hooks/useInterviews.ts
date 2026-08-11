"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { interviewService, CreateInterviewParams } from "@/services/interview/interview.service";
import { useAuthStore } from "@/store/auth.store";

export function useInterviews() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const sessionsQuery = useQuery({
    queryKey: ["interviews", user?.id],
    queryFn: () => (user ? interviewService.getSessions(user.id) : []),
    enabled: !!user,
  });

  const createMutation = useMutation({
    mutationFn: (params: Omit<CreateInterviewParams, "userId">) => {
      if (!user) throw new Error("User not authenticated");
      return interviewService.createSession({
        ...params,
        userId: user.id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interviews", user?.id] });
    },
  });

  return {
    sessions: sessionsQuery.data || [],
    isLoading: sessionsQuery.isLoading,
    error: sessionsQuery.error,
    createSession: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
  };
}
