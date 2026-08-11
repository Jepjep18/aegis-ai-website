"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { resumeService } from "@/services/resume/resume.service";
import { useAuthStore } from "@/store/auth.store";

export function useResumes() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const resumesQuery = useQuery({
    queryKey: ["resumes", user?.id],
    queryFn: () => (user ? resumeService.getResumes(user.id) : []),
    enabled: !!user,
  });

  const uploadMutation = useMutation({
    mutationFn: ({ file, title }: { file: File; title: string }) => {
      if (!user) throw new Error("User not authenticated");
      return resumeService.uploadResume(user.id, file, title);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes", user?.id] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => resumeService.deleteResume(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes", user?.id] });
    },
  });

  return {
    resumes: resumesQuery.data || [],
    isLoading: resumesQuery.isLoading,
    error: resumesQuery.error,
    uploadResume: uploadMutation.mutateAsync,
    isUploading: uploadMutation.isPending,
    deleteResume: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
