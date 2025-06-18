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
import { set } from "mongoose";


export default function UserProfilePage() {
  const { userId } = useParams();
  const [user, setUser] = useState<IUser | null>(null);

  const { getUser, loading, error } = useGetUserProfile();

  // const { currentUser: user} = useAppSelector(state=>state.user)
  useEffect(() => {
    const fetchUser = async () => {
      const result = await getUser(userId as string)
      if(result?.success){
        setUser(result?.data);
      }
      console.log(result)
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
      <div className="flex flex-col gap-6 max-w-8xl mx-auto py-8">
        <UserProfileHeader user={user} />
        <UserStats user={user} />
        <Card className="shadow-xl border rounded-2xl">
          <CardContent>
            <UserTabs user={user} />
          </CardContent>
        </Card>
      </div>
    ) : (
      <div className="py-10 w-full h-screen grid place-items-center text-xl md:text-5xl">No user found.</div>
    )
  );
}
