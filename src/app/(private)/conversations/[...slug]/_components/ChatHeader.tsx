import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Link from "next/link";

interface GroupChatHeaderProps {
  name: string;
  avatar: string;
  participantCount?: number;
  type: "duo" | "group";
}

export function ChatHeader({
  name,
  avatar,
  participantCount,
  type,
}: GroupChatHeaderProps) {
  return (
    <header className="px-4 py-3 border-b flex items-center sticky top-0 bg-background z-10">
      <Link href="/conversations" passHref>
        <Button variant="ghost" size="icon" className="mr-2">
          <ArrowLeftIcon className="h-4 w-4" />
          <span className="sr-only">Go back</span>
        </Button>
      </Link>

      <Avatar className="h-8 w-8">
        <AvatarImage src={avatar} alt={name} />
        <AvatarFallback>{name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="ml-3">
        <p className="text-sm font-medium">{name}</p>
        {type === "group" && (
          <p className="text-xs text-muted-foreground">
            {participantCount} members
          </p>
        )}
        {type === "duo" && (
          <p className="text-xs text-muted-foreground">Online</p>
        )}
      </div>
    </header>
  );
}
