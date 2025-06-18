"use client";

import Image from "next/image";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserPlus } from "lucide-react";
import { useAppSelector } from "@/lib/store/hooks";

const suggestedUsers = [
  {
    id: 1,
    name: "Arjun Mehta",
    username: "arjun.m",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 2,
    name: "Meera Kaur",
    username: "meerakaur",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: 3,
    name: "Dev Sharma",
    username: "dev.sh",
    avatar: "https://randomuser.me/api/portraits/men/55.jpg",
  },
  {
    id: 4,
    name: "Simran Kapoor",
    username: "simrank",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    id: 5,
    name: "Aniket Roy",
    username: "aniket.r",
    avatar: "https://randomuser.me/api/portraits/men/75.jpg",
  },{
    id: 6,
    name: "Arjun Mehta",
    username: "arjun.m",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 7,
    name: "Meera Kaur",
    username: "meerakaur",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: 8,
    name: "Dev Sharma",
    username: "dev.sh",
    avatar: "https://randomuser.me/api/portraits/men/55.jpg",
  },
  {
    id: 9,
    name: "Simran Kapoor",
    username: "simrank",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    id: 10,
    name: "Aniket Roy",
    username: "aniket.r",
    avatar: "https://randomuser.me/api/portraits/men/75.jpg",
  },
];

export default function RightSidebar() {
    const { currentUser } = useAppSelector(state=>state.user);

  return (
    <aside className="w-full max-w-xs space-y-4 p-2">
      {/* Logged In User Card */}
      <Card className="flex items-center p-3">
        <Image
          src={ currentUser?.avatar?.at(-1) ?? process.env.NEXT_PUBLIC_FALLBACK_IMAGE_URL ?? "https://randomuser.me/api/portraits/men/75.jpg"}
          alt="User Avatar"
          width={50}
          height={50}
          className="rounded-full mr-3"
        />
        <div>
          <h4 className="font-semibold">{currentUser?.fullName}</h4>
          <p className="text-sm text-muted-foreground">{currentUser?.username}</p>
        </div>
      </Card>

      {/* Suggested Users */}
      <Card>
        <CardHeader>
          <h3 className="font-bold text-lg">Suggested for you</h3>
        </CardHeader>
        <ScrollArea className="h-screen max-h-96">
          <CardContent className="space-y-3">
            {suggestedUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div>
                    <h4 className="font-medium text-sm">{user.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      @{user.username}
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
