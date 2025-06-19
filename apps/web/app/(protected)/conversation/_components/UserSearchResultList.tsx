"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Crown } from "lucide-react";
import { IUser } from "@/types/user/user.types";

interface UserSearchResultListProps {
  users: IUser[];
  onSelectUser: (user: IUser) => void;
}

export default function UserSearchResultList({
  users,
  onSelectUser,
}: UserSearchResultListProps) {
  if (users.length === 0) {
    return (
      <div className="text-center text-muted-foreground text-sm mt-4">
        No users found.
      </div>
    );
  }

  return (
    <Card className="mt-3 border shadow">
      <ScrollArea className="max-h-72">
        <CardContent className="p-2">
          {users.map((user) => (
            <div
              key={user._id}
              className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-muted cursor-pointer"
              onClick={() => onSelectUser(user)}
            >
              <Image
                src={user.avatar?.at(-1) || "/fallback-cover.jpg"}
                alt={user.fullName}
                width={38}
                height={38}
                className="rounded-full object-cover"
              />
              <div className="flex flex-col flex-1">
                <span className="font-medium text-sm">{user.fullName}</span>
                <span className="text-xs text-muted-foreground">@{user.username}</span>
              </div>

              {/* Optional: show premium badge */}
              {user.premiumStatus !== "none" && (
                <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                  <Crown size={12} className="text-yellow-500" />
                  {user.premiumStatus}
                </Badge>
              )}
            </div>
          ))}
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
