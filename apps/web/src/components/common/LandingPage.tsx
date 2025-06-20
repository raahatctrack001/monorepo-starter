"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import ImageCarousel from "./ImageCarousal";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex flex-col items-center justify-center text-white px-4">
      <div className="max-w-4xl w-full text-center space-y-8">
        <h1 className="text-5xl font-bold leading-tight">
          Welcome to <span className="text-purple-400">Social Desk</span>
        </h1>
        <p className="text-xl text-gray-300">
          “Every connection you make shapes your world. Don’t just scroll —
          leave your mark.”
        </p>

        <Card className="mt-8 bg-gray-900 border-gray-700 shadow-lg">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold text-purple-400">
              Why Join Social Desk?
            </h2>
            <ul className="text-gray-300 mt-4 space-y-2 text-left list-disc list-inside">
              <li>Meet people who inspire you.</li>
              <li>Share stories, moments, and ideas effortlessly.</li>
              <li>Join live streams and exclusive VR experiences.</li>
              <li>Build a community that celebrates you.</li>
            </ul>
          </CardContent>
        </Card>

        <div className="flex justify-center gap-6">
          <Link href="/login">
            <Button size="lg" variant="default" className="px-6 text-lg cursor-pointer md:w-sm">
              Login
            </Button>
          </Link>
          <Link href="/register">
            <Button size="lg" variant="outline" className="px-6 text-lg cursor-pointer md:w-sm">
              Register
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
        <ImageCarousel />


      </div>
    </div>
  );
}
