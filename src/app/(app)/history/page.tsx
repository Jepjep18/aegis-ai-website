"use client";

import { useState } from "react";
import AppHeader from "@/components/app/layout/AppHeader";
import NewInterviewModal from "@/components/app/interviews/NewInterviewModal";
import { Card } from "@/components/ui/card";
import { History, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function HistoryPage() {
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);

  return (
    <>
      <AppHeader onNewInterviewClick={() => setIsInterviewModalOpen(true)} />

      <main className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Interview History</h2>
            <p className="text-sm text-slate-400 mt-1">
              Review transcript history, AI generated answers, and evidence sources from past interviews.
            </p>
          </div>

          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search history..."
              className="pl-9 h-10 rounded-xl bg-white/5 border-white/10"
            />
          </div>
        </div>

        <Card className="p-12 text-center border-dashed">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-cyan-500/10 text-cyan-400 mb-4">
            <History className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold text-white">No history records yet</h3>
          <p className="mt-2 text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            Completed interview sessions will appear here with full transcript archives, keyword matches, and AI coaching suggestions.
          </p>
        </Card>
      </main>

      <NewInterviewModal
        open={isInterviewModalOpen}
        onOpenChange={setIsInterviewModalOpen}
      />
    </>
  );
}
