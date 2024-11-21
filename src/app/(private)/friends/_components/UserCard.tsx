import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import AddFriendButton from "./AddFriendBtn";

type User = {
  isFriend: boolean;
  isSent: boolean;
  id: string;
  email: string;
  username: string;
  avatar: string;
};

export default function UserCard({ user }: { user: User }) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={user.avatar} alt={user.username} />
            <AvatarFallback>{user.username[0]}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{user.username}</span>
        </div>

        {user.isSent && (
          <Button disabled size="sm">
            Request Sent
          </Button>
        )}

        {user.isFriend && (
          <Button variant="outline" size="sm">
            Message
          </Button>
        )}

        {!user.isSent && !user.isFriend && <AddFriendButton userId={user.id} />}
      </CardContent>
    </Card>
  );
}
