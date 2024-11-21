"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function FriendsTabNavigation() {
  const pathname = usePathname();

  let currentTab = "friends";
  if (pathname.includes("/requests")) {
    currentTab = "requests";
  } else if (pathname.includes("/add")) {
    currentTab = "add";
  }

  return (
    <Tabs
      value={currentTab}
      className="w-full sticky top-0 z-10 bg-background/80 backdrop-blur-sm"
    >
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="friends" asChild>
          <Link href="/friends">Friends</Link>
        </TabsTrigger>
        <TabsTrigger value="requests" asChild>
          <Link href="/friends/requests">Requests</Link>
        </TabsTrigger>
        <TabsTrigger value="add" asChild>
          <Link href="/friends/add">Add Friends</Link>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
