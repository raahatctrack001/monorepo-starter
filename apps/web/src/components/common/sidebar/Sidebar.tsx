"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Search,
  Compass,
  Video,
  Send,
  Heart,
  PlusSquare,
  User,
  Menu
} from "lucide-react";
import SidebarBottomDropdown from "../SidebarBottomDropdown";
import { useAppSelector } from "@/lib/store/hooks";


export default function Sidebar() {
  const pathname = usePathname();
  const { currentUser } = useAppSelector(state=>state.user);

  const navItems = [
    { label: "Home", icon: Home, href: "/" },
    { label: "Search", icon: Search, href: "/search" },
    { label: "Explore", icon: Compass, href: "/explore" },
    { label: "Reels", icon: Video, href: "/reels" },
    { label: "Conversation", icon: Send, href: "/conversation" },
    { label: "Notifications", icon: Heart, href: "/notifications" },
    { label: "Create", icon: PlusSquare, href: "/create" },
    { label: "Profile", icon: User, href: `/profile/${currentUser?._id}` },
  ];

  return (
    <aside className="h-screen border-r w-20 md:w-64 p-4 flex flex-col justify-between">
      <div>
        <h1 className="text-lg md:text-3xl font-bold mb-6 px-2 flex items-start">Social Desk</h1>
        <nav className="space-y-2 flex flex-col items-center md:items-start ">
          {navItems.map(({ label, icon: Icon, href }) => (
            <Link
              key={label}
              href={href}
              className={`flex items-center gap-4 px-3 py-2 rounded-xl transition hover:bg-gray-100 dark:hover:bg-gray-800 ${
                pathname === href
                  ? "bg-gray-100 dark:bg-gray-800 font-semibold"
                  : ""
              }`}
            >
              <Icon className="w-6 h-6" name={label}/>
              <span className="text-base hidden md:inline">{label}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div>
        <span
          
          className={`flex items-center gap-4 px-3 py-2 rounded-xl transition hover:bg-gray-100 dark:hover:bg-gray-800 ${
            pathname === ""
              ? "bg-gray-100 dark:bg-gray-800 font-semibold"
              : ""
          }`}
        >
          <Menu className="w-6 h-6" />
          <SidebarBottomDropdown />
        </span>
      </div>
    </aside>
  );
}
