"use client"
import LandingPage from "@/components/common/LandingPage";
import Sidebar from "@/components/common/sidebar/Sidebar";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/lib/store/hooks";

import { useRouter } from "next/navigation";

export default function Home() {
  const { currentUser } = useAppSelector(state=>state.user)
  const router = useRouter();
  if(!currentUser)
      return <LandingPage />
  else
    router.push(`/homepage/${currentUser?._id}`)
  return <></>
}