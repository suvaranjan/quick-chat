import prisma from "../db";
import { GroupRole } from "@prisma/client";

export const createDuoConversation = async (
  user1Id: string,
  user2Id: string
) => {
  return await prisma.duoConversation.create({
    data: {
      user1Id,
      user2Id,
    },
  });
};

export const findDuoConversationsForUser = async (
  userId: string,
  limit: number,
  cursor?: Date
) => {
  const conversations = await prisma.duoConversation.findMany({
    where: {
      OR: [{ user1Id: userId }, { user2Id: userId }],
      ...(cursor ? { updatedAt: { lt: cursor } } : {}),
    },
    include: {
      user1: {
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      },
      user2: {
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      },
      messages: {
        orderBy: {
          timestamp: "desc",
        },
        take: 1,
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
    take: limit,
  });

  const lastConversation = conversations[conversations.length - 1];
  const nextCursor = lastConversation?.updatedAt;

  return {
    conversations,
    nextCursor,
  };
};

export const findGroupConversationsForUser = async (
  userId: string,
  limit: number,
  cursor?: Date
) => {
  const conversations = await prisma.groupConversation.findMany({
    where: {
      participants: {
        some: {
          userId: userId,
        },
      },
      ...(cursor ? { updatedAt: { lt: cursor } } : {}),
    },
    include: {
      participants: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
        },
      },
      messages: {
        orderBy: {
          timestamp: "desc",
        },
        take: 1,
      },
      groupAdmin: {
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
    take: limit,
  });

  const lastConversation = conversations[conversations.length - 1];
  const nextCursor = lastConversation?.updatedAt;

  return {
    conversations,
    nextCursor,
  };
};

export const findDuoConversationById = async (conversationId: string) => {
  return await prisma.duoConversation.findUnique({
    where: { id: conversationId },
    include: {
      user1: {
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      },
      user2: {
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      },
    },
  });
};

export const findGroupConversationById = async (conversationId: string) => {
  return await prisma.groupConversation.findUnique({
    where: {
      id: conversationId,
    },
    select: {
      id: true,
      name: true,
      groupAvatar: true,
      participants: {
        select: {
          userId: true,
        },
      },
    },
  });
};

export const createGroupConversation = async (
  name: string,
  groupAdminId: string,
  participantIds: string[]
) => {
  return await prisma.groupConversation.create({
    data: {
      name,
      groupAdminId,
      participants: {
        create: [
          { userId: groupAdminId, role: GroupRole.ADMIN },
          ...participantIds.map((id) => ({
            userId: id,
            role: GroupRole.MEMBER,
          })),
        ],
      },
    },
    include: {
      participants: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          },
        },
      },
      groupAdmin: {
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      },
    },
  });
};

export const updateGroupParticipantRole = async (
  groupId: string,
  userId: string,
  role: GroupRole
) => {
  return await prisma.groupParticipant.update({
    where: {
      userId_groupConversationId: {
        userId,
        groupConversationId: groupId,
      },
    },
    data: { role },
  });
};
