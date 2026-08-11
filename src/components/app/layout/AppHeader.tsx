"use client";

import { usePathname } from "next/navigation";
import { sidebarNavigation } from "@/components/app/sidebar/sidebar-data";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

interface AppHeaderProps {
  onNewInterviewClick?: () => void;
}

export default function AppHeader({ onNewInterviewClick }: AppHeaderProps) {
  const pathname = usePathname();

  const currentNav = sidebarNavigation.find(
    (nav) => nav.href === pathname || pathname?.startsWith(`${nav.href}/`)
  );

  const title = currentNav?.title || "Dashboard";

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-white/5 bg-[#051424]/80 px-6 backdrop-blur-xl">
      <div>
        <h1 className="text-xl font-semibold text-white tracking-tight">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {onNewInterviewClick ? (
          <Button
            onClick={onNewInterviewClick}
            className="h-10 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-500 font-medium text-[#051424] shadow-lg shadow-cyan-500/20 hover:opacity-95"
          >
            <Plus className="mr-2 h-4 w-4 stroke-[2.5]" />
            New Interview
          </Button>
        ) : (
          <Button
            asChild
            className="h-10 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-500 font-medium text-[#051424] shadow-lg shadow-cyan-500/20 hover:opacity-95"
          >
            <Link href="/interviews">
              <Plus className="mr-2 h-4 w-4 stroke-[2.5]" />
              New Interview
            </Link>
          </Button>
        )}
      </div>
    </header>
  );
}
