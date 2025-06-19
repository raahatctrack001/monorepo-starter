"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Search } from "lucide-react";
import Image from "next/image";
import axios from "axios";
import { useAppSelector } from "@/lib/store/hooks";
import { IUser } from "@/types/user/user.types";
import { useSearchUser } from "@/hooks/conversation/useSearchUser";

interface SearchContactsProps {
  onSelectUser: (user: IUser) => void;
  // onSearch: (query: string) => Promise<IUser[]>;
}
export default function SearchContacts({ onSelectUser }: SearchContactsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<IUser[]>([]);
  
  const { searchUser, loading, error } = useSearchUser();

  useEffect(() => {
    const fetchUsers = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        return;
      }
      const result = await searchUser(searchQuery);
      if(result?.success){
        setSearchResults(result.data.users)
      }
    };

    const delayDebounce = setTimeout(fetchUsers, 1000);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  return (
    <div className="mb-4">
      <div className="relative flex items-center">
        <Search className="absolute left-3 text-muted-foreground" size={18} />
        <Input
          type="text"
          placeholder="Search contacts…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 pr-10"
        />
        {loading && (
          <Loader2 className="absolute right-3 animate-spin text-muted-foreground" size={18} />
        )}
      </div>

      {searchResults.length > 0 && (
        <Card className="mt-2 shadow-lg border">
          <ScrollArea className="h-screen scroll-auto z-10">
            <CardContent className="p-2">
              {searchResults.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-muted cursor-pointer"
                  onClick={() => {
                    onSelectUser(user);
                    setSearchQuery("");
                    setSearchResults([]);
                  }}
                >
                  <Image
                    src={user.avatar?.at(-1) || process.env.NEXT_PUBLIC_FALLBACK_IMAGE_URL || "/fallback-cover.jpg"}
                    alt={user.fullName}
                    width={36}
                    height={36}
                    className="rounded-full"
                  />
                  <div className="text-sm font-medium">{user.fullName}</div>
                </div>
              ))}
            </CardContent>
          </ScrollArea>
        </Card>
      )}
    </div>
  );
}
