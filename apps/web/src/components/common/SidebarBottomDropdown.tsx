"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Menu, Settings, BookOpen, Palette, Flag, LogOut, SwitchCamera, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SidebarBottomDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-full flex items-center justify-start gap-3 px-3 py-2 text-base">
          <Menu className="w-6 h-6" />
          <span className="">More</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent side="right" align="start" className="w-56">
        <DropdownMenuItem>
          <Settings className="w-4 h-4 mr-3" />
          Settings
        </DropdownMenuItem>

        <DropdownMenuItem>
          <Activity className="w-4 h-4 mr-3" />
          Your Activity
        </DropdownMenuItem>

        <DropdownMenuItem>
          <BookOpen className="w-4 h-4 mr-3" />
          Saved
        </DropdownMenuItem>

        <DropdownMenuItem>
          <Palette className="w-4 h-4 mr-3" />
          Change Theme
        </DropdownMenuItem>

        <DropdownMenuItem>
          <Flag className="w-4 h-4 mr-3" />
          Report a Problem
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <SwitchCamera className="w-4 h-4 mr-3" />
          Switch Account
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <LogOut className="w-4 h-4 mr-3 text-red-500" />
          <span className="text-red-500">Log Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
