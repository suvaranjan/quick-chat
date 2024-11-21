import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserPlus, Users } from "lucide-react";

export default function NoConversationsCard() {
  return (
    <div className="flex flex-col h-full max-h-[500px] items-center justify-center">
      <Card className="w-full max-w-sm mx-auto shadow-md p-4">
        <CardHeader className="text-center">
          <CardTitle className="text-lg font-semibold">
            No Conversations Yet
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="mb-4">
            <div className="w-20 h-20 mx-auto mb-3 bg-gradient-to-br from-primary to-primary-foreground rounded-full flex items-center justify-center">
              <Users className="w-8 h-8 text-background" />
            </div>
            <p className="text-xs text-muted-foreground">
              It looks like you haven't started any conversations yet. Why not
              connect with friends or create a new chat room?
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex gap-2 justify-center">
          <Button
            className="text-xs px-3 py-1 flex items-center"
            variant="default"
          >
            <UserPlus className="mr-1 h-3 w-3" />
            Make Friends
          </Button>
          <Button
            className="text-xs px-3 py-1 flex items-center"
            variant="outline"
          >
            <Users className="mr-1 h-3 w-3" />
            Create Room
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
