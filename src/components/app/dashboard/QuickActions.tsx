"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Video, Upload, History, ArrowRight } from "lucide-react";

interface QuickActionsProps {
  onNewInterviewClick?: () => void;
  onUploadResumeClick?: () => void;
}

export default function QuickActions({
  onNewInterviewClick,
  onUploadResumeClick,
}: QuickActionsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white tracking-tight">Quick Actions</h3>
      <div className="grid gap-4 sm:grid-cols-3">
        {/* Action 1: New Interview */}
        <div
          onClick={onNewInterviewClick}
          className="group cursor-pointer"
        >
          <Card className="p-6 transition-all duration-300 group-hover:-translate-y-1 group-hover:border-cyan-500/40 group-hover:bg-cyan-500/[0.05]">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300 group-hover:bg-cyan-400 group-hover:text-[#051424] transition-colors">
                <Video className="h-6 w-6" />
              </div>
              <ArrowRight className="h-5 w-5 text-slate-500 transition-transform group-hover:translate-x-1 group-hover:text-cyan-400" />
            </div>
            <h4 className="mt-4 text-base font-semibold text-white">Start New Interview</h4>
            <p className="mt-1 text-xs text-slate-400 leading-relaxed">
              Create an AI copilot session for a targeted job role.
            </p>
          </Card>
        </div>

        {/* Action 2: Upload Resume */}
        <div
          onClick={onUploadResumeClick}
          className="group cursor-pointer"
        >
          <Card className="p-6 transition-all duration-300 group-hover:-translate-y-1 group-hover:border-sky-500/40 group-hover:bg-sky-500/[0.05]">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-400/10 text-sky-300 group-hover:bg-sky-400 group-hover:text-[#051424] transition-colors">
                <Upload className="h-6 w-6" />
              </div>
              <ArrowRight className="h-5 w-5 text-slate-500 transition-transform group-hover:translate-x-1 group-hover:text-sky-400" />
            </div>
            <h4 className="mt-4 text-base font-semibold text-white">Upload Resume</h4>
            <p className="mt-1 text-xs text-slate-400 leading-relaxed">
              Add your latest experience PDF to power answer generation.
            </p>
          </Card>
        </div>

        {/* Action 3: History */}
        <Link href="/history" className="group">
          <Card className="p-6 transition-all duration-300 group-hover:-translate-y-1 group-hover:border-indigo-500/40 group-hover:bg-indigo-500/[0.05]">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-400/10 text-indigo-300 group-hover:bg-indigo-400 group-hover:text-[#051424] transition-colors">
                <History className="h-6 w-6" />
              </div>
              <ArrowRight className="h-5 w-5 text-slate-500 transition-transform group-hover:translate-x-1 group-hover:text-indigo-400" />
            </div>
            <h4 className="mt-4 text-base font-semibold text-white">View History</h4>
            <p className="mt-1 text-xs text-slate-400 leading-relaxed">
              Review past questions, transcript recordings, and feedback.
            </p>
          </Card>
        </Link>
      </div>
    </div>
  );
}
