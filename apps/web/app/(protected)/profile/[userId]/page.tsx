"use client";

import { useEffect, useState } from "react";
import { UserProfileHeader } from "../_components/UserProfileHeader";
import { UserStats } from "../_components/UserStats";
import { UserTabs } from "../_components/UserTabs";
import { Card, CardContent } from "@/components/ui/card";
import { useAppSelector } from "@/lib/store/hooks";
import { useParams } from "next/navigation";
import { useGetUserProfile } from "@/hooks/user/useGetUserProfile";
import GlobalLoader from "@/components/common/GlobalLoader";
import { IUser } from "@/types/user/user.types";
import RedAlert from "@/components/common/RedAlert";
import { userApi } from "@/lib/apiEndPoints/userEndpoints";


export default function UserProfilePage() {
  const { userId } = useParams();
  const { getUser, loading, error } = useGetUserProfile();

  const { currentUser: user} = useAppSelector(state=>state.user)
  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch(userApi.getUserProfile(userId as string), {
        method: "GET",
        credentials: "include"
      });
      const data = await response.json();
      if (data?.success) {
        console.log("userprofiledadta", data)
      }
    };

    fetchUser();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);


  if (loading)
    return <GlobalLoader heading="Please wait" description="We are fetching data from server." />;

  if(error){
    return <RedAlert heading="Fetch User Error" description={error} />
  }
return (
    loading ? (
      <GlobalLoader heading="Please wait" description="We are fetching data from server." />
    ) : user ? (
      <div className="flex flex-col gap-6 max-w-5xl mx-auto py-8">
        <UserProfileHeader user={user} />
        <UserStats user={user} />
        <Card className="shadow-xl border rounded-2xl">
          <CardContent>
            <UserTabs user={user} />
          </CardContent>
        </Card>
      </div>
    ) : (
      <div className="text-center text-muted py-10">No user found.</div>
    )
  );
}
