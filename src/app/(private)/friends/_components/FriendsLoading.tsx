import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function FriendsLoading({ required }: { required: number }) {
  return (
    <div className="grid gap-4 md:grid-cols-1 px-4">
      {Array.from({ length: required }, (_, i) => (
        <FriendLoadingCard key={i} />
      ))}
    </div>
  );
}

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EllipsisVertical } from "lucide-react";

function FriendLoadingCard() {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-4">
          <Skeleton className="size-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            {/* <Skeleton className="h-4 w-[200px]" /> */}
          </div>
        </div>
        <Button variant="ghost" size="icon" disabled>
          <EllipsisVertical className="h-4 w-4" />
          <span className="sr-only">Loading menu</span>
        </Button>
      </CardContent>
    </Card>
  );
}
