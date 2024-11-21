"use client";

import { Equal, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreateGroupSheet from "./CreateGroup";

export default function ChatListHeader() {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const pathname = usePathname();

  const toggleSearch = () => setIsSearchVisible(!isSearchVisible);

  const handleTabChange = (value: string) => {
    console.log(value);
  };

  return (
    <>
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
        {!isSearchVisible ? (
          <div className="flex items-center justify-between p-2">
            <Tabs
              value={pathname.startsWith("/rooms") ? "/rooms" : "/chat"}
              onValueChange={handleTabChange}
              className="pl-4"
            >
              <TabsList>
                <TabsTrigger value="/chat">All Chats</TabsTrigger>
                <TabsTrigger value="/rooms">Unread</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" onClick={toggleSearch}>
                <Search className="h-5 w-5" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Equal className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsCreateGroupOpen(true)}>
                    Create Group
                  </DropdownMenuItem>
                  <DropdownMenuItem>Create Room</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ) : (
          <div className="flex-1 p-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search"
                className="pl-10 pr-10"
                autoFocus
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={toggleSearch}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
      <CreateGroupSheet
        isOpen={isCreateGroupOpen}
        onOpenChange={setIsCreateGroupOpen}
      />
    </>
  );
}
