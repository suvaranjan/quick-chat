"use client";

import { useChat } from "./ChatContext";
import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MessageListProps {
  currentUserId: string;
  isGroupChat: boolean;
}

export function MessageList({ currentUserId, isGroupChat }: MessageListProps) {
  const { messages, loadMoreMessages, hasMore, isLoading } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <ScrollArea className="flex-1 p-4">
      {hasMore && (
        <div className="text-center py-2">
          <Button
            onClick={loadMoreMessages}
            disabled={isLoading}
            size="sm"
            variant="outline"
            className="text-xs"
          >
            {isLoading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Loading..." : "Load older messages"}
          </Button>
        </div>
      )}
      <div className="space-y-4">
        {messages.map((message, index) => (
          <MessageItem
            isGroupChat={isGroupChat}
            key={message.id}
            message={message}
            currentUserId={currentUserId}
            showAvatar={isGroupChat && shouldShowAvatar(messages, index)}
            isLastMessageFromUser={
              index === messages.length - 1 ||
              message.senderId !== messages[index + 1].senderId
            }
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
}

interface MessageItemProps {
  message: {
    id: string;
    content: string;
    senderId: string;
    senderName: string;
    senderAvatar: string;
    timestamp: string;
  };
  currentUserId: string;
  showAvatar: boolean;
  isLastMessageFromUser: boolean;
  isGroupChat: boolean;
}

function MessageItem({
  message,
  currentUserId,
  showAvatar,
  isGroupChat,
}: // isLastMessageFromUser,
MessageItemProps) {
  const isCurrentUser = message.senderId === currentUserId;

  return (
    <div
      className={cn("flex", {
        "justify-end": isCurrentUser,
        "ml-10": !isCurrentUser && !showAvatar && isGroupChat,
      })}
    >
      {!isCurrentUser && showAvatar && (
        <Avatar className="h-8 w-8 mr-2 self-start">
          <AvatarImage src={message.senderAvatar} alt={message.senderName} />
          <AvatarFallback>{message.senderName.charAt(0)}</AvatarFallback>
        </Avatar>
      )}
      <div className="flex flex-col w-full">
        {!isCurrentUser && showAvatar && (
          <span className="text-xs text-muted-foreground mb-1">
            {message.senderName}
          </span>
        )}
        <div
          className={cn(
            "p-3 rounded-lg max-w-[75%] text-sm shadow-sm",
            isCurrentUser
              ? "bg-primary text-primary-foreground self-end"
              : "bg-secondary text-secondary-foreground self-start",
            {
              "rounded-tr-none": isCurrentUser && showAvatar,
              "rounded-tl-none": !isCurrentUser && showAvatar,
            }
          )}
        >
          <p>{message.content}</p>
          <p className="text-xs mt-1 opacity-70">
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>
    </div>
  );
}

function shouldShowAvatar(
  messages: MessageItemProps["message"][],
  index: number
): boolean {
  if (index === 0) return true;
  const currentMessage = messages[index];
  const previousMessage = messages[index - 1];
  return currentMessage.senderId !== previousMessage.senderId;
}
