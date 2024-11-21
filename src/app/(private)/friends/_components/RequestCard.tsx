"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { acceptFriendRequest, rejectFriendRequest } from "@/actions/friend";

type Request = {
  id: string;
  sender: {
    id: string;
    username: string;
    avatar: string;
  };
};

type RequestCardProps = {
  request: Request;
};

export default function RequestCard({ request }: RequestCardProps) {
  const [isAccepting, setIsAccepting] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAccept = async () => {
    setIsAccepting(true);
    try {
      await acceptFriendRequest(request.id);
      // Handle successful acceptance (e.g., remove from list, show notification)
    } catch (error) {
      console.error("Error accepting friend request:", error);
      setError("Failed to accept friend request");
    } finally {
      setIsAccepting(false);
    }
  };

  const handleReject = async () => {
    setIsRejecting(true);
    try {
      await rejectFriendRequest(request.id);
      // Handle successful rejection (e.g., remove from list, show notification)
    } catch (error) {
      console.error("Error rejecting friend request:", error);
      setError("Failed to reject friend request");
    } finally {
      setIsRejecting(false);
    }
  };

  if (error) {
    return <p className="text-center text-red-500 mt-2">{error}</p>;
  }

  return (
    <Card>
      <CardContent className="flex items-center p-4">
        <div className="flex-shrink-0">
          <Avatar>
            <AvatarImage
              src={request.sender.avatar}
              alt={request.sender.username}
            />
            <AvatarFallback>{request.sender.username[0]}</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col md:flex-row md:justify-between ml-4 flex-grow md:items-center">
          <p className="font-medium">{request.sender.username}</p>
          <div className="flex space-x-2 mt-2 md:mt-0">
            <Button
              size="sm"
              variant="default"
              onClick={handleAccept}
              disabled={isAccepting || isRejecting}
            >
              {isAccepting ? "Accepting..." : "Accept"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleReject}
              disabled={isAccepting || isRejecting}
            >
              {isRejecting ? "Rejecting..." : "Reject"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
