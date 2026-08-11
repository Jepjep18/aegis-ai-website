"use client";

import { useAuthStore } from "@/store/auth.store";
import { authService } from "@/services/auth/auth.service";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User as UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface SidebarUserProps {
  collapsed: boolean;
}

export default function SidebarUser({ collapsed }: SidebarUserProps) {
  const { user } = useAuthStore();
  const router = useRouter();

  const email = user?.email ?? "user@example.com";
  const initials = email.substring(0, 2).toUpperCase();

  const handleSignOut = async () => {
    await authService.signOut();
    router.push("/sign-in");
  };

  return (
    <div className="p-3 border-t border-white/5">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors hover:bg-white/5 outline-none">
            <Avatar className="h-9 w-9 border border-white/10">
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex flex-1 flex-col overflow-hidden">
                <span className="truncate text-sm font-medium text-white">
                  {user?.user_metadata?.full_name || email.split("@")[0]}
                </span>
                <span className="truncate text-xs text-slate-400">
                  {email}
                </span>
              </div>
            )}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push("/settings")}>
            <UserIcon className="mr-2 h-4 w-4 text-slate-400" />
            <span>Profile & Settings</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut} className="text-red-400 hover:text-red-300">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign Out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
