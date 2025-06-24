"use client";

import { Construction } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function UnderDevelopmentPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-slate-950 to-slate-900 text-white p-6">
      <div className="flex flex-col items-center text-center space-y-6 max-w-lg">
        <Construction size={64} className="text-yellow-500 animate-bounce" />
        <h1 className="text-4xl font-extrabold tracking-tight">
          Page Under Development 🚧
        </h1>
        <p className="text-lg text-gray-300">
          We&apos;re working hard to bring you this feature soon. Check back later or head back to the home page.
        </p>

        <Link href="/">
          <Button className="mt-4 text-lg px-6 py-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition">
            Go to Home
          </Button>
        </Link>
      </div>

      <div className="absolute bottom-6 text-sm text-gray-500">
        © {new Date().getFullYear()} Social Desk. All rights reserved.
      </div>
    </div>
  );
}
