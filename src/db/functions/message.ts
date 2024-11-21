import { Prisma } from "@prisma/client";
import prisma from "../db";

export const fetchMessages = async (
  conversationId: string,
  limit: number,
  cursor?: Date
) => {
  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { duoConversationId: conversationId },
        { groupConversationId: conversationId },
      ],
      ...(cursor ? { timestamp: { lt: cursor } } : {}),
    },
    include: {
      sender: {
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      },
      seenBy: {
        select: {
          userId: true,
          seenAt: true,
        },
      },
    },
    orderBy: {
      timestamp: "desc",
    },
    take: limit,
  });

  const lastMessage = messages[messages.length - 1];
  const nextCursor = lastMessage?.timestamp;

  return {
    messages,
    nextCursor,
  };
};

export const createMessage = async (
  conversationId: string,
  senderId: string,
  content: string
) => {
  const duoConversation = await prisma.duoConversation.findUnique({
    where: { id: conversationId },
  });

  const messageData: Prisma.MessageCreateInput = {
    content,
    type: "TEXT",
    sender: { connect: { id: senderId } },
  };

  if (duoConversation) {
    messageData.duoConversation = { connect: { id: conversationId } };
  } else {
    messageData.groupConversation = { connect: { id: conversationId } };
  }

  const message = await prisma.message.create({
    data: messageData,
    include: {
      sender: {
        select: {
          username: true,
          avatar: true,
        },
      },
    },
  });

  return message;
};
