"use client";

import Image from "next/image";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Repeat, UserPlus } from "lucide-react";
import { useAppSelector } from "@/lib/store/hooks";
import { useEffect, useState } from "react";
import { IUser } from "@/types/user/user.types";
import { useGetAllUserProfile } from "@/hooks/user/useGetAllUserProfile";
import RedAlert from "../RedAlert";
import LocalLoader from "../LocalLoader";



export default function RightSidebar() {
    const { currentUser } = useAppSelector(state=>state.user);
    const [users, setUsers] = useState<IUser[]|null>(null)
    const { getAllUser, loading, error } = useGetAllUserProfile();
    useEffect(()=>{
      (async ()=>{
        const result = await getAllUser(currentUser?._id as string);
        if(result?.success){
          setUsers(result.data.users);
        }
      })()
    }, [])
    
    
    return (
      <aside className="w-full max-w-md space-y-4 p-2">
        {/* Logged In User Card */}
        <Card className="flex bg-blue-800  items-center p-3 w-full">
          <div className="flex justify-between items-center">
            <Image
              src={ currentUser?.avatar?.at(-1) ?? process.env.NEXT_PUBLIC_FALLBACK_IMAGE_URL ?? "https://randomuser.me/api/portraits/men/75.jpg"}
              alt="User Avatar"
              width={50}
            height={50}
              className="rounded-full mr-3"
              />
            <div>
              <div className="flex justify-center items-center gap-5">
                <h4 className="font-semibold">{currentUser?.fullName}</h4>
                <span className="cursor-pointer"> <Repeat/> </span>
              </div>
              <p className="text-sm text-muted-foreground">{currentUser?.username}</p>
            </div>
          </div>
        </Card>

        {/* Suggested Users */}
        <Card>
          <CardHeader>
            <h3 className="font-bold text-lg border-b-4 shadow-md pb-2">Suggested for you</h3>
            {loading && <LocalLoader heading="Loading suggested users"/>}
            {error && <RedAlert heading="Failed to fetch Users" description={error} />}
          </CardHeader>
          <ScrollArea className="h-screen max-h-96">
            <CardContent className="space-y-3">
              {users && users.map((user) => (
                <div
                key={user?._id}
                className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Image
                      src={user?.avatar?.at(-1) ?? process.env.NEXT_PUBLIC_FALLBACK_IMAGE_URL ?? "https://randomuser.me/api/portraits/men/75.jpg"}
                      alt={user?.fullName}
                      width={40}
                      height={40}
                      className="rounded-full"
                      />
                    <div>
                      <h4 className="font-medium text-sm">{user?.fullName}</h4>
                      <p className="text-xs text-muted-foreground">
                        @{user?.username}
                      </p>
                    </div>
                  </div>
                  <Button size="icon" variant="secondary">
                    <UserPlus className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </ScrollArea>
        </Card>
      </aside>
    );
}
