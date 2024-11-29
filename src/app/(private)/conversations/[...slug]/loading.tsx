import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";

export default function LoadingChatDisplay() {
  return (
    <div className="h-full flex flex-col min-h-screen">
      <header className="px-4 py-3 bg-secondary flex items-center">
        <Button variant="ghost" size="icon" className="mr-2" disabled>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Skeleton className="w-9 h-9 rounded-full mr-2" />
        <div className="ml-3 flex-1">
          <Skeleton className="w-28 h-5 rounded-md" />
          <Skeleton className="w-20 h-3 mt-1 rounded-md" />
        </div>
      </header>

      <div className="flex-1 p-4 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-muted-foreground size-6" />
      </div>

      <div className="p-4 border-t sticky bottom-0 bg-background">
        <div className="flex space-x-2 items-center">
          <Skeleton className="flex-1 h-9 rounded-md" />
          <Button size="icon" className="mr-2" disabled>
            <ArrowTopRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
