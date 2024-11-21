"use client";

// import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
// import {
//   removeFriend,
//   blockFriend,
//   messageFriend,
// } from "@/app/actions/friendActions";

type Friend = {
  id: string;
  username: string;
  avatar: string;
};

type FriendCardProps = {
  friend: Friend;
};

export default function FriendCard({ friend }: FriendCardProps) {
  // const [isLoading, setIsLoading] = useState(false);

  const handleRemoveFriend = async () => {
    // setIsLoading(true);
    // await removeFriend(friend.id);
    // setIsLoading(false);
  };

  const handleBlockFriend = async () => {
    // setIsLoading(true);
    // await blockFriend(friend.id);
    // setIsLoading(false);
  };

  const handleMessageFriend = async () => {
    // await messageFriend(friend.id);
  };

  return (
    <Card>
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={friend.avatar} alt={friend.username} />
            <AvatarFallback>{friend.username[0]}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{friend.username}</span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              // disabled={isLoading}
            >
              <EllipsisVertical className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleRemoveFriend}>
              Remove
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleBlockFriend}>
              Block
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleMessageFriend}>
              Message
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardContent>
    </Card>
  );
}
