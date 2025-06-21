"use client";

import LandingPage from "@/components/common/LandingPage";
import { useAppSelector } from "@/lib/store/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { currentUser } = useAppSelector((state) => state.user);
  const router = useRouter();

  useEffect(() => {
    if (currentUser) {
      router.push(`/homepage/${currentUser._id}`);
    }
  }, [currentUser, router]);

  // while useEffect waits to run — show LandingPage if no user
  if (!currentUser) return <LandingPage />;

  // optionally a fallback loader while redirect happens
  return null;
}
