import type { Metadata } from "next";
import Sidebar from "@/components/common/Sidebar";

export const metadata: Metadata = {
  title: "homepage",
  description: "Developed by Captain",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <aside className="w-64"> <Sidebar /> </aside>
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}

