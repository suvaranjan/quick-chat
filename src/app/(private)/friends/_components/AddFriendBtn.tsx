"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { sendFriendRequest } from "@/actions/friend";
import { toast } from "sonner";

export default function AddFriendButton({ userId }: { userId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleAddFriend = () => {
    startTransition(async () => {
      const result = await sendFriendRequest(userId);
      if (result.error) {
        toast.error(result.error.message);
      } else if (result.success) {
        toast.success(result.message);
      }
    });
  };

  return (
    <Button onClick={handleAddFriend} disabled={isPending} size="sm">
      {isPending ? "Sending..." : "Add Friend"}
    </Button>
  );
}
