import { Suspense } from "react";
import { cookies } from "next/headers";
import { Chat } from "./_components/Chat";
import LoadingChats from "./_components/LoadingChatList";
import NoConversationsCard from "./_components/NoConversations";
import { getConversations } from "@/actions/chat";
import { GetConversationsResponse } from "@/types/conversationTypes";
import ErrorCard from "@/components/mycomps/ErrorCard";

export default function ConversationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<LoadingChats />}>
      <ChatData>{children}</ChatData>
    </Suspense>
  );
}

async function ChatData({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const layout = cookieStore.get("react-resizable-panels:layout");
  const defaultLayout = layout ? JSON.parse(layout.value) : [30, 70];

  const result: GetConversationsResponse = await getConversations();

  if ("error" in result) {
    return <ErrorCard message={result.error.message} />;
  }

  const conversations = result.conversations;
  const nextCursor = result.nextCursor;

  if (conversations.length === 0) {
    return <NoConversationsCard />;
  }

  return (
    <Chat
      initialConversations={conversations}
      nextCursor={nextCursor}
      defaultLayout={defaultLayout}
    >
      {children}
    </Chat>
  );
}
