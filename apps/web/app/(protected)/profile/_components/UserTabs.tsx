"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IUser, IWebsite } from "@/types/user/user.types";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const UserTabs = ({ user }: {user: IUser|null}) => {
    const router = useRouter();
  if(!user){
    router.push('/login')
  }
  return (
    <Tabs defaultValue="about">
      <TabsList className="mb-4">
        <TabsTrigger value="about">About</TabsTrigger>
        <TabsTrigger value="posts">Posts</TabsTrigger>
        <TabsTrigger value="followers">Followers</TabsTrigger>
        <TabsTrigger value="following">Following</TabsTrigger>
      </TabsList>

      <TabsContent value="about">
        <div className="space-y-4">
          <p className="text-muted-foreground">Bio: {user?.bio?.join(", ")}</p>
          <div>
            <h4 className="font-medium mb-2">Websites:</h4>
            {user?.website?.map((site: IWebsite, i: number) => (
              <div key={i}>
                <Link
                  href={site.url}
                  target="_blank"
                  className="text-blue-600 hover:underline"
                >
                  {site.name}
                </Link>
                <p className="text-sm text-muted-foreground">{site.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="posts">
        <p className="text-muted-foreground">User posts will appear here.</p>
      </TabsContent>

      <TabsContent value="followers">
        <p className="text-muted-foreground">List of followers here.</p>
      </TabsContent>

      <TabsContent value="following">
        <p className="text-muted-foreground">List of followings here.</p>
      </TabsContent>
    </Tabs>
  );
};
