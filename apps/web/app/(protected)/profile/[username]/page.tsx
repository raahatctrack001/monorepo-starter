"use client";

import { UserProfileHeader } from "../_components/UserProfileHeader";
import { UserStats } from "../_components/UserStats";
import { UserTabs } from "../_components/UserTabs";
import { Card, CardContent } from "@/components/ui/card";
import { useAppSelector } from "@/lib/store/hooks";


export default function UserProfilePage() {
  const { currentUser: user } = useAppSelector(state=>state.user)

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto py-8">
      <UserProfileHeader user={user} />
      <UserStats user={user} />
      <Card className="shadow-xl border rounded-2xl">
        <CardContent>
          <UserTabs user={user} />
        </CardContent>
      </Card>
    </div>
  );
}
