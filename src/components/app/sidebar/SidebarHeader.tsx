"use client";

import Link from "next/link";
import { Shield, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarHeaderProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export default function SidebarHeader({
  collapsed,
  onToggleCollapse,
}: SidebarHeaderProps) {
  return (
    <div className="flex h-16 items-center justify-between px-4 border-b border-white/5">
      <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-sky-500 text-[#051424]">
          <Shield className="h-5 w-5 fill-current" />
        </div>
        {!collapsed && (
          <span className="font-semibold text-white tracking-wide text-lg">
            Aegis<span className="text-cyan-400">.AI</span>
          </span>
        )}
      </Link>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={onToggleCollapse}
        className="text-slate-400 hover:text-white"
      >
        {collapsed ? (
          <PanelLeftOpen className="h-4 w-4" />
        ) : (
          <PanelLeftClose className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
