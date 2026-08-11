"use client";

import { Card } from "@/components/ui/card";
import { Video, FileText, CheckCircle2, Zap } from "lucide-react";

interface DashboardStatsProps {
  totalInterviews?: number;
  totalResumes?: number;
  completedSessions?: number;
  creditsRemaining?: number;
}

export default function DashboardStats({
  totalInterviews = 0,
  totalResumes = 0,
  completedSessions = 0,
  creditsRemaining = 10,
}: DashboardStatsProps) {
  const stats = [
    {
      title: "Total Interviews",
      value: totalInterviews,
      icon: Video,
      description: "Created sessions",
      color: "text-cyan-400",
      bgColor: "bg-cyan-400/10",
    },
    {
      title: "Resumes Library",
      value: totalResumes,
      icon: FileText,
      description: "Uploaded resumes",
      color: "text-sky-400",
      bgColor: "bg-sky-400/10",
    },
    {
      title: "Completed",
      value: completedSessions,
      icon: CheckCircle2,
      description: "Finished interviews",
      color: "text-emerald-400",
      bgColor: "bg-emerald-400/10",
    },
    {
      title: "AI Session Credits",
      value: creditsRemaining,
      icon: Zap,
      description: "Available credits",
      color: "text-amber-400",
      bgColor: "bg-amber-400/10",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="p-5 flex items-center gap-4">
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${stat.bgColor} ${stat.color}`}>
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400">{stat.title}</p>
              <h3 className="text-2xl font-bold text-white mt-0.5">{stat.value}</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">{stat.description}</p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
