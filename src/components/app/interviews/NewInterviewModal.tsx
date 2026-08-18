"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useResumes } from "@/hooks/useResumes";
import { useInterviews } from "@/hooks/useInterviews";
import { useAuthStore } from "@/store/auth.store";
import {
  getSessionDurationMinutes,
  resolvePlan,
  SESSION_DURATIONS,
} from "@/lib/config/interview.config";
import { Building2, Briefcase, FileText, Cpu, Sparkles, ArrowRight, ArrowLeft, Timer } from "lucide-react";
import { toast } from "sonner";

interface NewInterviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function NewInterviewModal({
  open,
  onOpenChange,
}: NewInterviewModalProps) {
  const router = useRouter();
  const { user } = useAuthStore();
  const { resumes } = useResumes();
  const { createSession, isCreating } = useInterviews();

  const plan = resolvePlan(user?.user_metadata?.plan as "free" | "premium" | undefined);

  const [step, setStep] = useState(1);
  const [companyName, setCompanyName] = useState("");
  const [position, setPosition] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [aiModel, setAiModel] = useState("GPT-4o");
  const [interviewType, setInterviewType] = useState("Technical");

  const handleNext = () => {
    if (step === 1 && (!companyName.trim() || !position.trim())) {
      toast.error("Please fill in company name and position");
      return;
    }
    if (step === 2 && !jobDescription.trim()) {
      toast.error("Please paste the job description");
      return;
    }
    if (step === 3 && !selectedResumeId) {
      if (resumes.length === 0) {
        toast.error("Please upload a resume first");
        return;
      }
      toast.error("Please select a resume");
      return;
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleCreate = async () => {
    try {
      const session = await createSession({
        companyName,
        position,
        jobDescription,
        resumeId: selectedResumeId || resumes[0]?.id,
        aiModel,
        interviewType,
        plan,
      });

      toast.success("Interview session created!");
      onOpenChange(false);
      // Reset state
      setStep(1);
      setCompanyName("");
      setPosition("");
      setJobDescription("");

      // Navigate to workspace page
      router.push(`/interviews/${session.id}`);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to create interview session"
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-1">
            <span>STEP {step} OF 4</span>
          </div>
          <DialogTitle>Create Interview Session</DialogTitle>
          <DialogDescription>
            Configure your AI Copilot context for target job relevance.
          </DialogDescription>
        </DialogHeader>

        {/* Step 1: Target Role */}
        {step === 1 && (
          <div className="space-y-4 my-2">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-cyan-400" />
                Company Name
              </Label>
              <Input
                placeholder="e.g. Stripe, Vercel, Meta"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="h-11 rounded-xl bg-white/5 border-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-cyan-400" />
                Target Position / Role
              </Label>
              <Input
                placeholder="e.g. Senior Fullstack Engineer"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="h-11 rounded-xl bg-white/5 border-white/10"
              />
            </div>
          </div>
        )}

        {/* Step 2: Job Description */}
        {step === 2 && (
          <div className="space-y-4 my-2">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-cyan-400" />
                Paste Job Description
              </Label>
              <Textarea
                rows={6}
                placeholder="Paste the full job posting here. Aegis will extract key technical skills, requirements, and keywords..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="rounded-xl bg-white/5 border-white/10"
              />
            </div>
          </div>
        )}

        {/* Step 3: Select Resume */}
        {step === 3 && (
          <div className="space-y-4 my-2">
            <Label className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-cyan-400" />
              Select Resume for Grounding Evidence
            </Label>

            {resumes.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-center">
                <p className="text-sm text-slate-300">No resumes uploaded yet.</p>
                <p className="text-xs text-slate-500 mt-1">
                  You can upload a resume in the Resumes section first, or proceed with a default resume context.
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {resumes.map((res) => (
                  <div
                    key={res.id}
                    onClick={() => setSelectedResumeId(res.id)}
                    className={`flex items-center justify-between rounded-xl border p-3.5 cursor-pointer transition-all ${
                      selectedResumeId === res.id || (!selectedResumeId && resumes[0].id === res.id)
                        ? "border-cyan-400/50 bg-cyan-500/10 text-white"
                        : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-cyan-400" />
                      <div>
                        <p className="text-sm font-medium">{res.title}</p>
                        <p className="text-xs text-slate-400">{res.file_name}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 4: AI Model & Interview Type */}
        {step === 4 && (
          <div className="space-y-4 my-2">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-cyan-400" />
                AI Model Engine
              </Label>
              <div className="grid grid-cols-3 gap-3">
                {["GPT-4o", "Claude 3.5 Sonnet", "Gemini 2.5 Flash"].map((model) => (
                  <button
                    key={model}
                    type="button"
                    onClick={() => setAiModel(model)}
                    className={`rounded-xl border p-3 text-xs font-medium transition-all ${
                      aiModel === model
                        ? "border-cyan-400 bg-cyan-500/10 text-cyan-300"
                        : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/10"
                    }`}
                  >
                    {model}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-cyan-400" />
                Interview Type / Focus
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {["Technical", "Behavioral (STAR)", "System Design", "Coding / Live"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setInterviewType(type)}
                    className={`rounded-xl border p-3 text-xs font-medium transition-all ${
                      interviewType === type
                        ? "border-cyan-400 bg-cyan-500/10 text-cyan-300"
                        : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/10"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <p className="mt-4 flex items-center gap-1.5 text-xs text-slate-500">
          <Timer className="h-3.5 w-3.5" />
          Session length: {getSessionDurationMinutes(plan)} minutes
          {plan === "free" && ` · upgrade to premium for ${SESSION_DURATIONS.premium} minutes`}
        </p>

        <DialogFooter className="mt-6 flex items-center justify-between sm:justify-between">
          {step > 1 ? (
            <Button
              type="button"
              variant="ghost"
              onClick={handleBack}
              className="rounded-xl"
            >
              <ArrowLeft className="mr-1 h-4 w-4" /> Back
            </Button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <Button
              type="button"
              onClick={handleNext}
              className="rounded-xl bg-cyan-400 text-[#051424] hover:bg-cyan-300 font-semibold"
            >
              Next <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="button"
              disabled={isCreating}
              onClick={handleCreate}
              className="rounded-xl bg-gradient-to-r from-cyan-400 to-sky-500 text-[#051424] hover:opacity-95 font-semibold"
            >
              {isCreating ? "Building Context..." : "Start Interview Session"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
