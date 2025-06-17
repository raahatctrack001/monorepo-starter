"use client";

import Image from "next/image";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { IUser } from "@/types/user/user.types";

export const UserProfileHeader = ({ user }: {user: IUser|null}) => {
  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-lg">
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

      <div className="flex items-center gap-4 px-6 py-4 bg-background">
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
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold">{user?.fullName}</h2>
          <p className="text-muted-foreground text-sm">@{user?.username}</p>
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
