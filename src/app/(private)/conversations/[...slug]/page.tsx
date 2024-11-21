import { fetchConversation, fetchConversationMessages } from "@/actions/chat";
import { ChatProvider } from "./_components/ChatContext";
import { MessageList } from "./_components/MessageList";
import { MessageInput } from "./_components/MessageInput";
import { Conversation } from "@/types/conversationTypes";
import { notFound } from "next/navigation";
import { ChatHeader } from "./_components/ChatHeader";
import ErrorCard from "@/components/mycomps/ErrorCard";

export default async function ConversationPage(props: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await props.params;
  const [conversationId, conversationType] = slug as [string, "duo" | "group"];

  if (conversationType !== "duo" && conversationType !== "group")
    return notFound();

  const [conversationResult, messagesResult] = await Promise.all([
    fetchConversation(conversationType, conversationId),
    fetchConversationMessages(conversationId, 20),
  ]);

  if ("error" in conversationResult || "error" in messagesResult)
    return <ErrorCard message="Unable to load Conversation" />;

  const conversation = conversationResult as Conversation;
  const { messages, nextCursor, loginUserId } = messagesResult;

  return (
    <div className="flex flex-col h-full min-h-screen bg-background">
      <ChatHeader
        name={conversation.name}
        avatar={conversation.avatar}
        participantCount={
          conversation.type === "group"
            ? conversation.participantCount
            : undefined
        }
        type={conversation.type}
      />
      <ChatProvider
        conversationId={conversationId}
        initialMessages={messages}
        initialNextCursor={nextCursor}
      >
        <MessageList
          currentUserId={loginUserId}
          isGroupChat={conversation.type === "group"}
        />
        <MessageInput />
      </ChatProvider>
    </div>
  );
}
