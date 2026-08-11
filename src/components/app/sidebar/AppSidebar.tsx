"use client";

import { useState } from "react";
import { sidebarNavigation } from "./sidebar-data";
import SidebarHeader from "./SidebarHeader";
import SidebarItem from "./SidebarItem";
import SidebarUser from "./SidebarUser";
import { cn } from "@/lib/utils";

export default function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "relative flex flex-col border-r border-white/10 bg-[#07111F]/80 backdrop-blur-2xl transition-all duration-300 z-30 shrink-0",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <SidebarHeader
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
      />

      <nav className="flex-1 space-y-1.5 p-3 overflow-y-auto">
        {sidebarNavigation.map((item) => (
          <SidebarItem
            key={item.href}
            title={item.title}
            href={item.href}
            icon={item.icon}
            collapsed={collapsed}
          />
        ))}
      </nav>

      <SidebarUser collapsed={collapsed} />
    </aside>
  );
}
