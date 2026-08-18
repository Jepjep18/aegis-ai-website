"use client";

import { useState } from "react";
import AppHeader from "@/components/app/layout/AppHeader";
import NewInterviewModal from "@/components/app/interviews/NewInterviewModal";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/auth.store";
import { User, Cpu, Shield, Key } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || "");
  const [defaultAiModel, setDefaultAiModel] = useState("GPT-4o");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Settings saved successfully");
  };

  return (
    <>
      <AppHeader onNewInterviewClick={() => setIsInterviewModalOpen(true)} />

      <main className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6 max-w-4xl">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Account & App Settings</h2>
          <p className="text-sm text-slate-400 mt-1">
            Configure your profile details, default AI engine preferences, and security settings.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Section 1: Profile */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-2 text-white font-semibold text-base border-b border-white/5 pb-3">
              <User className="h-5 w-5 text-cyan-400" />
              <span>Profile Information</span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input
                  disabled
                  value={user?.email || ""}
                  className="h-11 rounded-xl bg-white/5 border-white/10 text-slate-400"
                />
              </div>
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  placeholder="Jefferson Arnado"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="h-11 rounded-xl bg-white/5 border-white/10"
                />
              </div>
            </div>
          </Card>

          {/* Section 2: AI Engine Settings */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-2 text-white font-semibold text-base border-b border-white/5 pb-3">
              <Cpu className="h-5 w-5 text-cyan-400" />
              <span>Default AI Engine</span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {["GPT-4o", "Claude 3.5 Sonnet", "Gemini 2.5 Flash"].map((model) => (
                <button
                  key={model}
                  type="button"
                  onClick={() => setDefaultAiModel(model)}
                  className={`rounded-xl border p-4 text-xs font-medium text-left transition-all ${
                    defaultAiModel === model
                      ? "border-cyan-400 bg-cyan-500/10 text-cyan-300"
                      : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/10"
                  }`}
                >
                  <p className="font-semibold text-sm text-white">{model}</p>
                  <p className="text-[11px] text-slate-400 mt-1">Default model for live interviews</p>
                </button>
              ))}
            </div>
          </Card>

          {/* Section 3: API Credentials */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-2 text-white font-semibold text-base border-b border-white/5 pb-3">
              <Key className="h-5 w-5 text-cyan-400" />
              <span>Custom API Key (Optional)</span>
            </div>
            <div className="space-y-2">
              <Label>Bring Your Own OpenAI / Anthropic Key</Label>
              <Input
                type="password"
                placeholder="sk-proj-..."
                className="h-11 rounded-xl bg-white/5 border-white/10"
              />
              <p className="text-xs text-slate-500">
                Leave blank to use Aegis default cloud credits.
              </p>
            </div>
          </Card>

          <div className="flex justify-end">
            <Button
              type="submit"
              className="rounded-xl bg-gradient-to-r from-cyan-400 to-sky-500 font-semibold text-[#051424] hover:opacity-95 px-8 h-11"
            >
              Save Preferences
            </Button>
          </div>
        </form>
      </main>

      <NewInterviewModal
        open={isInterviewModalOpen}
        onOpenChange={setIsInterviewModalOpen}
      />
    </>
  );
}
