"use server";

import { auth } from "@clerk/nextjs/server";
import {
  findDuoConversationsForUser,
  findGroupConversationsForUser,
  findDuoConversationById,
  findGroupConversationById,
  createGroupConversation as createGroupConversationRepo,
} from "@/db/functions/conversation";
import { findUserByClerkId } from "@/db/functions/user";
import { fetchMessages, createMessage } from "@/db/functions/message";

export async function getConversations(limit = 5, cursor?: string) {
  const { userId } = await auth();
  if (!userId) return { error: { message: "Not authenticated" } };

  try {
    const loggedInUser = await findUserByClerkId(userId);
    if (!loggedInUser) return { error: { message: "User not found" } };

    const cursorDate = cursor ? new Date(cursor) : undefined;

    // Fetch duo conversations
    const duoResult = await findDuoConversationsForUser(
      loggedInUser.id,
      limit,
      cursorDate
    );

    // Fetch group conversations
    const groupResult = await findGroupConversationsForUser(
      loggedInUser.id,
      limit,
      cursorDate
    );

    // Combine and sort all conversations
    const allConversations = [
      ...duoResult.conversations.map((conv) => ({
        conversationId: conv.id,
        type: "duo" as const,
        name:
          conv.user1.id === loggedInUser.id
            ? conv.user2.username
            : conv.user1.username,
        avatar:
          conv.user1.id === loggedInUser.id
            ? conv.user2.avatar || "/default-avatar.png"
            : conv.user1.avatar || "/default-avatar.png",
        latestMessage: conv.messages[0]?.content || "",
        unread: 0, // Hardcoded as specified
        updatedAt: conv.updatedAt,
      })),
      ...groupResult.conversations.map((conv) => ({
        conversationId: conv.id,
        type: "group" as const,
        name: conv.name || "Group Chat",
        avatar: conv.groupAvatar || "/default-group-avatar.png",
        latestMessage: conv.messages[0]?.content || "",
        unread: 0, // Hardcoded as specified
        updatedAt: conv.updatedAt,
      })),
    ].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

    // Take only the first 'limit' conversations
    const conversations = allConversations.slice(0, limit);

    // Determine the next cursor
    const lastConversation = conversations[conversations.length - 1];
    const nextCursor = lastConversation
      ? lastConversation.updatedAt.toISOString()
      : null;

    return {
      conversations,
      nextCursor,
    };
  } catch (error) {
    console.error("Error getting conversations:", error);
    return { error: { message: "Failed to get conversations" } };
  }
}

type ConversationType = "duo" | "group";

export async function fetchConversation(type: ConversationType, id: string) {
  const { userId } = await auth();
  if (!userId) return { error: { message: "Not authenticated" } };

  try {
    const loggedInUser = await findUserByClerkId(userId);
    if (!loggedInUser) return { error: { message: "User not found" } };

    if (type === "duo") {
      return fetchDuoConversation(id, loggedInUser.id);
    } else if (type === "group") {
      return fetchGroupConversation(id, loggedInUser.id);
    } else {
      return { error: { message: "Invalid conversation type" } };
    }
  } catch (error) {
    console.error("Error fetching conversation:", error);
    return { error: { message: "Failed to fetch conversation" } };
  }
}

async function fetchDuoConversation(
  conversationId: string,
  loggedInUserId: string
) {
  const duoConversation = await findDuoConversationById(conversationId);

  if (duoConversation) {
    const otherUser =
      duoConversation.user1.id === loggedInUserId
        ? duoConversation.user2
        : duoConversation.user1;

    return {
      conversationId: duoConversation.id,
      loggedInUserId: loggedInUserId,
      type: "duo" as const,
      userId: otherUser.id,
      name: otherUser.username,
      avatar: otherUser.avatar || "/default-avatar.png",
    };
  } else {
    return { error: { message: "Duo conversation not found" } };
  }
}

export async function fetchGroupConversation(
  conversationId: string,
  loggedInUserId: string
) {
  const groupConversation = await findGroupConversationById(conversationId);

  if (groupConversation) {
    return {
      conversationId: groupConversation.id,
      loggedInUserId,
      type: "group" as const,
      name: groupConversation.name,
      avatar: groupConversation.groupAvatar,
      participantCount: groupConversation.participants.length,
    };
  } else {
    return { error: { message: "Group conversation not found" } };
  }
}

export async function fetchConversationMessages(
  conversationId: string,
  limit = 5,
  cursor?: string
) {
  const { userId } = await auth();
  if (!userId) return { error: { message: "Not authenticated" } };

  try {
    const loggedInUser = await findUserByClerkId(userId);
    if (!loggedInUser) return { error: { message: "User not found" } };

    const cursorDate = cursor ? new Date(cursor) : undefined;

    const { messages, nextCursor } = await fetchMessages(
      conversationId,
      limit,
      cursorDate
    );

    // Transform messages for client consumption
    const transformedMessages = messages.map((message) => ({
      id: message.id,
      content: message.content,
      type: message.type,
      timestamp: message.timestamp.toISOString(),
      senderId: message.senderId,
      senderName: message.sender.username,
      senderAvatar: message.sender.avatar,
      seenBy: message.seenBy.map((seen) => ({
        userId: seen.userId,
        seenAt: seen.seenAt.toISOString(),
      })),
    }));

    return {
      loginUserId: loggedInUser.id,
      messages: transformedMessages.reverse(),
      nextCursor: nextCursor ? nextCursor.toISOString() : null,
    };
  } catch (error) {
    console.error("Error fetching conversation messages:", error);
    return { error: { message: "Failed to fetch conversation messages" } };
  }
}

export async function sendMessage(conversationId: string, content: string) {
  const { userId } = await auth();
  if (!userId) return { error: { message: "Not authenticated" } };

  try {
    const loggedInUser = await findUserByClerkId(userId);
    if (!loggedInUser) return { error: { message: "User not found" } };

    const message = await createMessage(
      conversationId,
      loggedInUser.id,
      content
    );

    return {
      message: {
        id: message.id,
        content: message.content,
        type: message.type,
        timestamp: message.timestamp.toISOString(),
        senderId: message.senderId,
        senderName: loggedInUser.username,
        senderAvatar: loggedInUser.avatar,
        seenBy: [],
      },
    };
  } catch (error) {
    console.error("Error sending message:", error);
    return { error: { message: "Failed to send message" } };
  }
}

export async function createGroupConversation(formData: FormData) {
  const { userId } = await auth();
  if (!userId) return { error: { message: "Not authenticated" } };

  try {
    const loggedInUser = await findUserByClerkId(userId);
    if (!loggedInUser) return { error: { message: "User not found" } };

    const name = formData.get("groupName") as string;
    const membersJson = formData.get("members") as string;
    const members = JSON.parse(membersJson) as { id: string }[];

    if (!name || !members || members.length === 0) {
      return { error: { message: "Invalid group data" } };
    }

    // Create group conversation
    const group = await createGroupConversationRepo(
      name,
      loggedInUser.id,
      members.map((m) => m.id)
    );

    return {
      success: true,
      data: group,
    };
  } catch (error) {
    console.error("Error creating group:", error);
    return { error: { message: "Failed to create group" } };
  }
}

// Helper action to validate group name
export async function validateGroupName(name: string) {
  if (!name || name.trim().length < 3) {
    return { error: { message: "Group name must be at least 3 characters" } };
  }

  if (name.trim().length > 50) {
    return { error: { message: "Group name must be less than 50 characters" } };
  }

  return { success: true };
}

// export async function fetchDuoConversation(conversationId: string) {
//   const { userId } = await auth();
//   if (!userId) return { error: { message: "Not authenticated" } };

//   try {
//     const loggedInUser = await findUserByClerkId(userId);
//     if (!loggedInUser) return { error: { message: "User not found" } };

//     const duoConversation = await findDuoConversationById(conversationId);

//     if (duoConversation) {
//       const otherUser =
//         duoConversation.user1.id === loggedInUser.id
//           ? duoConversation.user2
//           : duoConversation.user1;

//       return {
//         conversationId: duoConversation.id,
//         loggedInUser: loggedInUser.id,
//         type: "duo",
//         userId: otherUser.id,
//         name: otherUser.username,
//         avatar: otherUser.avatar || "/default-avatar.png",
//       };
//     } else {
//       return { error: { message: "Duo conversation not found" } };
//     }
//   } catch (error) {
//     console.error("Error fetching duo conversation:", error);
//     return { error: { message: "Failed to fetch duo conversation" } };
//   }
// }

// export async function fetchGroupConversation(conversationId: string) {
//   const { userId } = await auth();
//   if (!userId) return { error: { message: "Not authenticated" } };

//   try {
//     const loggedInUser = await findUserByClerkId(userId);
//     if (!loggedInUser) return { error: { message: "User not found" } };

//     const groupConversation = await findGroupConversationById(conversationId);

//     if (groupConversation) {
//       return {
//         conversationId: groupConversation.id,
//         loggedInUser: loggedInUser.id,
//         type: "group",
//         name: groupConversation.name || "Group Chat",
//         avatar: groupConversation.groupAvatar || "/default-group-avatar.png",
//         members: groupConversation.participants.map((p) => ({
//           id: p.user.id,
//           username: p.user.username,
//           avatar: p.user.avatar || "/default-avatar.png",
//         })),
//         admin: {
//           id: groupConversation.groupAdmin.id,
//           username: groupConversation.groupAdmin.username,
//           avatar: groupConversation.groupAdmin.avatar || "/default-avatar.png",
//         },
//       };
//     } else {
//       return { error: { message: "Group conversation not found" } };
//     }
//   } catch (error) {
//     console.error("Error fetching group conversation:", error);
//     return { error: { message: "Failed to fetch group conversation" } };
//   }
// }
