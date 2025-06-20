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
import { getDeviceInfo } from "@/lib/deviceInfo";
import { useLogoutUser } from "@/hooks/auth/useLogout";
import { useAppDispatch } from "@/lib/store/hooks";
import { logOutSuccess } from "@/lib/store/slices/user.slice";
import { useRouter } from "next/navigation";
import GlobalLoader from "./GlobalLoader";

export default function SidebarBottomDropdown() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { logoutUser, loading, error } = useLogoutUser();
  const handleLogout = async () => {
    try {
        const { token } = await getDeviceInfo();
        const result = await logoutUser({token});
        if(result?.success){
          dispatch(logOutSuccess());
          router.push('/login')
        }
    } catch (error) {
      console.log(error);
    }
  }

  if(loading){
    return <GlobalLoader heading="Please Wait..." description="Logout in process!" />
  }

  
  
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
          <Flag className="w-4 h-4 mr-3" />
          Report a Problem
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <SwitchCamera className="w-4 h-4 mr-3" />
          Switch Account
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-3 text-red-500" />
          <span className="text-red-500">Log Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
