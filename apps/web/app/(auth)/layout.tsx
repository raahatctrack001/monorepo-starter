"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left Branding Section */}
      <div className="hidden lg:flex w-1/2 bg-primary text-primary-foreground flex-col justify-center items-center p-10 space-y-6">
        <h1 className="text-4xl font-bold">🚀 Welcome to Social Desk</h1>
        <p className="text-lg text-primary-foreground/80 text-center max-w-md">
          Connect, share and grow with a vibrant community built for creators and dreamers like you.
        </p>
        <Link
          href="/"
          className="text-primary-foreground underline underline-offset-4 hover:text-primary-foreground/80"
        >
          Back to Home →
        </Link>
      </div>

      {/* Right Auth Section */}
      <div className="flex-1 flex flex-col justify-center items-center p-6">
        <div className="w-full flex flex-col items-center justify-center">
          {children}
        </div>
      </div>
    </div>
  );
}
