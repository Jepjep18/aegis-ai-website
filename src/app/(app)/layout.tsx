"use client";

import type { ReactNode } from "react";
import AppSidebar from "@/components/app/sidebar/AppSidebar";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen bg-[#051424]">
      <AppSidebar />
      <div className="flex flex-1 flex-col min-h-0 overflow-hidden">
        {children}
      </div>
    </div>
  );
}
