"use client";

import { Card, CardContent } from "@/components/ui/card";
import { IUser } from "@/types/user/user.types";

export const UserStats = ({ user }: {user: IUser|null}) => {
  const stats = [
    { title: "Posts", value: user?.postsCount },
    { title: "Followers", value: user?.followers?.length },
    { title: "Following", value: user?.followings?.length },
    { title: "Likes Received", value: user?.likesReceived },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="text-center shadow-md border rounded-xl">
          <CardContent className="p-4">
            <h4 className="text-xl font-semibold">{stat.value}</h4>
            <p className="text-muted-foreground text-sm">{stat.title}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
