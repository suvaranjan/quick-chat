import prisma from "../db";
import { RequestStatus } from "@prisma/client";

export const findFriends = async (userId: string) => {
  return await prisma.friend.findMany({
    where: { userId },
    include: { friend: true },
  });
};

export const createFriendRequest = async (
  senderId: string,
  receiverId: string
) => {
  return await prisma.friendRequest.create({
    data: { senderId, receiverId, status: RequestStatus.PENDING },
  });
};

export const findFriendRequest = async (
  senderId: string,
  receiverId: string
) => {
  return await prisma.friendRequest.findFirst({
    where: { senderId, receiverId },
  });
};

export const findReceivedFriendRequests = async (receiverId: string) => {
  return await prisma.friendRequest.findMany({
    where: { receiverId, status: RequestStatus.PENDING },
    include: {
      sender: {
        select: {
          id: true,
          username: true,
          avatar: true,
        },
      },
    },
  });
};

export const findFriendIds = async (userId: string) => {
  return await prisma.friend.findMany({
    where: { userId },
    select: { friendId: true },
  });
};

export const findSentFriendRequests = async (
  senderId: string,
  receiverIds: string[]
) => {
  return await prisma.friendRequest.findMany({
    where: {
      senderId,
      receiverId: { in: receiverIds },
    },
    select: { receiverId: true, status: true },
  });
};

export const findFriendRequestById = async (requestId: string) => {
  return await prisma.friendRequest.findUnique({
    where: { id: requestId },
    include: { sender: true, receiver: true },
  });
};

export const updateFriendRequestStatus = async (
  requestId: string,
  status: RequestStatus
) => {
  return await prisma.friendRequest.update({
    where: { id: requestId },
    data: { status },
  });
};

export const createFriendship = async (userId: string, friendId: string) => {
  await prisma.friend.createMany({
    data: [
      { userId, friendId },
      { userId: friendId, friendId: userId },
    ],
  });

  await prisma.friendRequest.updateMany({
    where: {
      OR: [
        { senderId: userId, receiverId: friendId },
        { senderId: friendId, receiverId: userId },
      ],
    },
    data: { status: RequestStatus.ACCEPTED },
  });
};

export const searchFriends = async (
  userId: string,
  query: string,
  limit: number = 10
) => {
  return await prisma.friend.findMany({
    where: {
      userId,
      friend: {
        OR: [
          { username: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
        ],
      },
    },
    include: {
      friend: {
        select: {
          id: true,
          username: true,
          email: true,
          avatar: true,
        },
      },
    },
    take: limit,
  });
};

export const findFriendsPaginated = async (
  userId: string,
  page: number,
  pageSize: number
) => {
  const skip = (page - 1) * pageSize;
  const [friends, totalCount] = await Promise.all([
    prisma.friend.findMany({
      where: { userId },
      include: { friend: true },
      skip,
      take: pageSize,
    }),
    prisma.friend.count({ where: { userId } }),
  ]);

  return {
    friends: friends.map((f) => f.friend),
    totalPages: Math.ceil(totalCount / pageSize),
    currentPage: page,
  };
};

export const findFriendRequestsPaginated = async (
  userId: string,
  page: number,
  pageSize: number
) => {
  const skip = (page - 1) * pageSize;
  const [requests, totalCount] = await Promise.all([
    prisma.friendRequest.findMany({
      where: { receiverId: userId, status: RequestStatus.PENDING },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    }),
    prisma.friendRequest.count({
      where: { receiverId: userId, status: RequestStatus.PENDING },
    }),
  ]);

  return {
    requests,
    totalPages: Math.ceil(totalCount / pageSize),
    currentPage: page,
  };
};
