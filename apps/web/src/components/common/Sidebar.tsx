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
import SidebarBottomDropdown from "./SidebarBottomDropdown";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: "Home", icon: Home, href: "/" },
    { label: "Search", icon: Search, href: "/search" },
    { label: "Explore", icon: Compass, href: "/explore" },
    { label: "Reels", icon: Video, href: "/reels" },
    { label: "Messages", icon: Send, href: "/messages" },
    { label: "Notifications", icon: Heart, href: "/notifications" },
    { label: "Create", icon: PlusSquare, href: "/create" },
    { label: "Profile", icon: User, href: "/profile" },
  ];

  return (
    <aside className="h-screen border-r w-64 p-4 flex flex-col justify-between">
      <div>
        <h1 className="text-3xl font-bold mb-6 px-2">Social Fusion</h1>
        <nav className="space-y-2">
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
              <Icon className="w-6 h-6" />
              <span className="text-base">{label}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div>
        <Link
          href="/more"
          className={`flex items-center gap-4 px-3 py-2 rounded-xl transition hover:bg-gray-100 dark:hover:bg-gray-800 ${
            pathname === "/more"
              ? "bg-gray-100 dark:bg-gray-800 font-semibold"
              : ""
          }`}
        >
          <Menu className="w-6 h-6" />
          <SidebarBottomDropdown />
        </Link>
      </div>
    </aside>
  );
}
