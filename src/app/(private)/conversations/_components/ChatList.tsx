import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import ChatListHeader from "./ChatListHeader";
import { ChatItem } from "@/types/conversationTypes";
import { formatDate } from "@/helper/formatDate";

interface ChatListProps {
  chats: ChatItem[];
  selectedChat: ChatItem | null;
  onSelectChat: (chat: ChatItem) => void;
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
}

interface ChatListItemProps {
  chat: ChatItem;
  selectedChat: ChatItem | null;
  onSelectChat: (chat: ChatItem) => void;
}

const getChatLink = (chat: ChatItem) => {
  switch (chat.type) {
    case "duo":
      return `/conversations/${chat.conversationId}/duo`;
    case "group":
      return `/conversations/${chat.conversationId}/group`;
    case "room":
      return `/conversations/${chat.conversationId}/rooms`;
    default:
      return "/chat";
  }
};

export function ChatList({
  chats,
  selectedChat,
  onSelectChat,
  onLoadMore,
  hasMore,
  isLoading,
}: ChatListProps) {
  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      onLoadMore();
    }
  }, [inView, hasMore, isLoading, onLoadMore]);

  return (
    <div className="flex flex-col h-full">
      <ChatListHeader />
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-2 p-4">
          {chats.map((chat) => (
            <ChatListItem
              key={chat.conversationId}
              chat={chat}
              selectedChat={selectedChat}
              onSelectChat={onSelectChat}
            />
          ))}
          {hasMore && (
            <div ref={ref} className="py-4 text-center">
              {isLoading && (
                <div className="flex items-center justify-center space-x-2">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span className="text-xs">Loading</span>
                </div>
              )}
            </div>
          )}
        </div>
        {/* {[...Array(20)].map((_, index) => (
          <div key={index} className="p-4 bg-gray-100 rounded-md">
            Scroll test item {index + 1}
          </div>
        ))} */}
      </ScrollArea>
    </div>
  );
}

function ChatListItem({ chat, selectedChat, onSelectChat }: ChatListItemProps) {
  return (
    <Link
      href={getChatLink(chat)}
      // href={`/conversations/${chat.conversationId}`}
      className={cn(
        "flex items-center space-x-4 p-3 rounded-lg cursor-pointer",
        selectedChat?.conversationId === chat.conversationId
          ? "bg-secondary"
          : "hover:bg-secondary/50"
      )}
      onClick={() => onSelectChat(chat)}
    >
      <Avatar>
        <AvatarImage src={chat.avatar} alt={chat.name} />
        <AvatarFallback>{chat.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{chat.name}</p>
        <p className="text-sm text-muted-foreground truncate">
          {chat.latestMessage}
        </p>
      </div>
      <div className="flex flex-col items-end gap-1">
        <p className="text-xs text-muted-foreground">
          {formatDate(String(chat.updatedAt))}
        </p>
        {chat.unread > 0 && (
          <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-background bg-primary rounded-full">
            {chat.unread}
          </span>
        )}
      </div>
    </Link>
  );
}
