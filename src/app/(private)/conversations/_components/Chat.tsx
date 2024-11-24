"use client";

import * as React from "react";
import { ChatList } from "./ChatList";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import { useRouter, usePathname } from "next/navigation";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { getConversations } from "@/actions/chat";
import LoadingChats from "./LoadingChatList";
import { ChatItem, GetConversationsResponse } from "@/types/conversationTypes";

interface ChatProps {
  initialConversations: ChatItem[];
  nextCursor: string | null;
  defaultLayout: number[];
  children: React.ReactNode;
}

export function Chat({
  initialConversations,
  nextCursor: initialNextCursor,
  defaultLayout,
  children,
}: ChatProps) {
  const [layout, setLayout] = useLocalStorage<number[]>(
    "chat-layout",
    defaultLayout
  );
  const [chats, setChats] = React.useState<ChatItem[]>(initialConversations);
  const [nextCursor, setNextCursor] = React.useState<string | null>(
    initialNextCursor
  );
  const [isLoading, setIsLoading] = React.useState(false);

  const isDesktop = useMediaQuery("(min-width: 768px)");
  const router = useRouter();
  const pathname = usePathname();

  const isChatSelected = pathname !== "/chat";

  const handleLayoutChange = React.useCallback(
    (sizes: number[]) => {
      setLayout(sizes);
    },
    [setLayout]
  );

  const handleSelectChat = React.useCallback(
    (chat: ChatItem) => {
      router.push(`/chat/${chat.conversationId}`);
    },
    [router]
  );

  const loadMoreConversations = React.useCallback(async () => {
    if (isLoading || !nextCursor) return;

    setIsLoading(true);
    const result: GetConversationsResponse = await getConversations(
      5,
      nextCursor
    );
    setIsLoading(false);

    if ("conversations" in result) {
      setChats((prevChats) => [...prevChats, ...result.conversations]);
      setNextCursor(result.nextCursor);
    } else if ("error" in result) {
      console.error(result.error.message);
    }
  }, [nextCursor, isLoading]);

  if (isDesktop === null) {
    return <LoadingChats />;
  }

  if (isDesktop) {
    return (
      <TooltipProvider delayDuration={0}>
        <ResizablePanelGroup
          direction="horizontal"
          onLayout={handleLayoutChange}
          // className="h-full max-h-[calc(100vh-1rem)] items-stretch"
          className="h-full max-h-screen items-stretch"
        >
          <ResizablePanel
            defaultSize={layout[0]}
            minSize={20}
            maxSize={40}
            className="max-w-md"
          >
            <ChatList
              chats={chats}
              selectedChat={null}
              onSelectChat={handleSelectChat}
              onLoadMore={loadMoreConversations}
              hasMore={!!nextCursor}
              isLoading={isLoading}
            />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={layout[1]} minSize={30}>
            {isChatSelected ? (
              children
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Select a chat to start conversation
              </div>
            )}
          </ResizablePanel>
        </ResizablePanelGroup>
      </TooltipProvider>
    );
  } else {
    return (
      <div className="h-[calc(100vh-4rem)]">
        {pathname === "/conversations" ? (
          <ChatList
            chats={chats}
            selectedChat={null}
            onSelectChat={handleSelectChat}
            onLoadMore={loadMoreConversations}
            hasMore={!!nextCursor}
            isLoading={isLoading}
          />
        ) : (
          children
        )}
      </div>
    );
  }
}
