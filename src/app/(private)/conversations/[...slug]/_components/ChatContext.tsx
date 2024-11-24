"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchConversationMessages, sendMessage } from "@/actions/chat";
import { pusherClient } from "@/lib/pusher";
import { find } from "lodash";

interface Message {
  id: string;
  content: string;
  type: string;
  timestamp: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  seenBy: { userId: string; seenAt: string }[];
}

interface ChatContextType {
  messages: Message[];
  sendMessage: (content: string) => Promise<void>;
  loadMoreMessages: () => Promise<void>;
  hasMore: boolean;
  isLoading: boolean;
}

const ChatContext = createContext<ChatContextType | null>(null);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

export const ChatProvider: React.FC<{
  children: React.ReactNode;
  conversationId: string;
  initialMessages: Message[];
  initialNextCursor: string | null;
}> = ({ children, conversationId, initialMessages, initialNextCursor }) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [nextCursor, setNextCursor] = useState<string | null>(
    initialNextCursor
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    pusherClient.subscribe(conversationId);

    const messageHandler = (message: Message) => {
      setMessages((prevMessages) => {
        if (find(prevMessages, { id: message.id })) {
          return prevMessages;
        }
        return [...prevMessages, message];
      });
    };

    pusherClient.bind("new-message", messageHandler);

    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind("new-message", messageHandler);
    };
  }, [conversationId]);

  const loadMoreMessages = async () => {
    if (!nextCursor || isLoading) return;

    setIsLoading(true);
    try {
      const result = await fetchConversationMessages(
        conversationId,
        20,
        nextCursor
      );
      if ("error" in result) {
        console.log(result.error);
        return;
      }
      setMessages((prevMessages) => [...result.messages, ...prevMessages]);
      setNextCursor(result.nextCursor);
    } catch (error) {
      console.error("Failed to load more messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessageHandler = async (content: string) => {
    try {
      const result = await sendMessage(conversationId, content);
      if ("error" in result) {
        console.error(result.error);
        return;
      }
      // The new message will be added through the Pusher event
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        sendMessage: sendMessageHandler,
        loadMoreMessages,
        hasMore: !!nextCursor,
        isLoading,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

// "use client";

// import React, { createContext, useContext, useState } from "react";
// import { fetchConversationMessages, sendMessage } from "@/actions/chat";

// interface Message {
//   id: string;
//   content: string;
//   type: string;
//   timestamp: string;
//   senderId: string;
//   senderName: string;
//   senderAvatar: string;
//   seenBy: { userId: string; seenAt: string }[];
// }

// interface ChatContextType {
//   messages: Message[];
//   sendMessage: (content: string) => Promise<void>;
//   loadMoreMessages: () => Promise<void>;
//   hasMore: boolean;
//   isLoading: boolean;
// }

// const ChatContext = createContext<ChatContextType | null>(null);

// export const useChat = () => {
//   const context = useContext(ChatContext);
//   if (!context) {
//     throw new Error("useChat must be used within a ChatProvider");
//   }
//   return context;
// };

// export const ChatProvider: React.FC<{
//   children: React.ReactNode;
//   conversationId: string;
//   initialMessages: Message[];
//   initialNextCursor: string | null;
// }> = ({ children, conversationId, initialMessages, initialNextCursor }) => {
//   const [messages, setMessages] = useState<Message[]>(initialMessages);
//   const [nextCursor, setNextCursor] = useState<string | null>(
//     initialNextCursor
//   );
//   const [isLoading, setIsLoading] = useState(false);

//   const loadMoreMessages = async () => {
//     if (!nextCursor || isLoading) return;

//     setIsLoading(true);
//     try {
//       const result = await fetchConversationMessages(
//         conversationId,
//         20,
//         nextCursor
//       );
//       if ("error" in result) {
//         console.log(result.error);
//         return;
//       }
//       setMessages((prevMessages) => [...result.messages, ...prevMessages]);
//       setNextCursor(result.nextCursor);
//     } catch (error) {
//       console.error("Failed to load more messages:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const sendMessageHandler = async (content: string) => {
//     try {
//       const result = await sendMessage(conversationId, content);
//       if ("error" in result) {
//         console.error(result.error);
//         return;
//       }
//       setMessages((prevMessages) => [...prevMessages, result.message]);
//     } catch (error) {
//       console.error("Failed to send message:", error);
//     }
//   };

//   return (
//     <ChatContext.Provider
//       value={{
//         messages,
//         sendMessage: sendMessageHandler,
//         loadMoreMessages,
//         hasMore: !!nextCursor,
//         isLoading,
//       }}
//     >
//       {children}
//     </ChatContext.Provider>
//   );
// };
