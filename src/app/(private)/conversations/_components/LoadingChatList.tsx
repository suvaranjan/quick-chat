import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchIcon, EqualIcon, Loader2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LoadingChats() {
  return (
    <div className="lg:max-w-sm">
      <ChatListHeaderSkeleton />
      <LoadingChatList required={5} />

      {/* If Display is large it add a border rightside to this comp*/}
      <div className="mobile-hidden flex absolute top-0 left-[440px] w-[1px] h-full bg-border items-center justify-center">
        {/* <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">
          <GripVertical className="h-2.5 w-2.5" />
        </div> */}
      </div>
    </div>
  );
}

function LoadingChatList({ required }: { required: number }) {
  return (
    <ScrollArea className="flex-1">
      <div className="flex flex-col gap-3 p-4">
        {Array.from({ length: required }).map((_, index) => (
          <div
            key={index}
            className="flex items-center space-x-4 p-3 rounded-lg bg-muted/20"
          >
            <Skeleton className="w-10 h-10 rounded-full" />

            <div className="flex-1 min-w-0 space-y-2">
              <Skeleton className="w-1/3 h-4 rounded-md" />
              <Skeleton className="w-2/3 h-4 rounded-md" />
            </div>

            <div className="flex flex-col items-end gap-1">
              <Skeleton className="w-10 h-3 rounded-md" />
              <Skeleton className="w-5 h-5 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

function ChatListHeaderSkeleton() {
  return (
    <div className="flex justify-between items-center p-2 border-b pl-7">
      <div className="flex items-center justify-center space-x-1">
        <h2 className="font-semibold text-muted-foreground">Loading</h2>
        <Button variant="ghost" size="icon" disabled>
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" disabled>
          <SearchIcon className="h-5 w-5 text-muted-foreground" />
        </Button>

        <Button variant="ghost" size="icon" disabled>
          <EqualIcon className="h-5 w-5 text-muted-foreground" />
        </Button>
      </div>
    </div>
  );
}
