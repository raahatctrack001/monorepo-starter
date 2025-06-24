"use client";

import Image from "next/image";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { IUser } from "@/types/user/user.types";
import { Button } from "@/components/ui/button";
import { Edit, MessageCircle, Settings, ThumbsUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/store/hooks";

export const UserProfileHeader = ({ user }: {user: IUser|null}) => {
  const { currentUser } = useAppSelector(state=>state.user);
  const router = useRouter();
  return (
    <div className="relative w-full  rounded-2xl overflow-scroll overflow-x-hidden shadow-lg">
      <div>
        <Image
          src={
            user?.coverPhoto?.at(-1) ??
            process.env.NEXT_PUBLIC_FALLBACK_IMAGE_URL ??
            "/fallback-cover.jpg"
          }
          alt="cover"
          width={1200}
          height={300}
          className="w-full h-60 object-cover"
        />
          <div className="flex justify-around w-full relative left-32">
            <div></div>   
            <Edit className="relative left-16 bottom-7 bg-black text-white cursor-pointer"/>
          </div>
      </div>
      <div className="flex items-center gap-4 px-6 py-4 bg-background">
        <div>
          <Avatar className="w-24 h-24 -mt-16 border-4 border-background shadow-xl">
              <AvatarImage 
                src={
                  user?.avatar?.at(-1) ??
                  process.env.NEXT_PUBLIC_FALLBACK_IMAGE_URL ??
                  "/fallback-cover.jpg"
                } 
                />
              <AvatarFallback>{user?.fullName.charAt(0)}</AvatarFallback>
          </Avatar>
          <Edit className="relative left-16 bottom-7 bg-black text-white rounded-lg cursor-pointer"/>
        </div>
        <div className="flex flex-col w-full">
            <div className="flex items-center w-full justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{user?.fullName}</h2>
                  <p className="text-muted-foreground text-sm">@{user?.username}</p>
                </div>

                <div className="space-x-2">
                    {
                      currentUser?._id !== user?._id && 
                        <>
                          <Button className="cursor-pointer" > 
                            <ThumbsUp name="like"/> 
                            <span className="hidden sm:inline"> Like </span> 
                          </Button>
                          <Button className="cursor-pointer" > 
                            <MessageCircle name="like"/> 
                            <span className="hidden sm:inline"> Message </span> 
                          </Button>
                          
                        </>
                    }
                    {
                      currentUser?._id === user?._id  && 
                      <>
                        <Button className="cursor-pointer" onClick={()=>router.push(`/edit-profile/${user?._id}`)} > <Edit /> <span className="hidden sm:inline"> Edit Profile </span>  </Button>
                        <Button className="cursor-pointer"> <Settings /> <span className="hidden sm:inline"> Settings </span> </Button>
                      </>
                    }
                </div>
            </div>
          <div className="flex gap-2 mt-2 flex-wrap">
            {user?.bio?.map((b: string, i: number) => (
              <Badge key={i} variant="secondary">
                {b}
              </Badge>
            ))}
            {user?.premiumStatus !== "none" && (
              <Badge variant="outline">{user?.premiumStatus?.toUpperCase()} MEMBER</Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
