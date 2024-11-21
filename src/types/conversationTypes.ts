export interface ChatItem {
  conversationId: string;
  name: string;
  avatar: string;
  updatedAt: Date;
  unread: number;
  type: string;
  latestMessage: string;
}

export type GetConversationsResponse =
  | {
      conversations: ChatItem[];
      nextCursor: string | null;
    }
  | {
      error: {
        message: string;
      };
    };

type DuoConversation = {
  conversationId: string;
  loggedInUserId: string;
  type: "duo";
  userId: string;
  name: string;
  avatar: string;
};

type GroupConversation = {
  conversationId: string;
  loggedInUserId: string;
  type: "group";
  name: string;
  avatar: string;
  participantCount: number;
};

export type Conversation = DuoConversation | GroupConversation;
