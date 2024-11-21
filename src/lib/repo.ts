// This file is no more needed

// import prisma from "@/db/db";
// import { Prisma, RequestStatus, GroupRole } from "@prisma/client";

// export const findByClerkId = async (clerkUserId: string) => {
//   return await prisma.user.findUnique({
//     where: { clerkUserId },
//   });
// };

// export const findFriends = async (userId: string) => {
//   return await prisma.friend.findMany({
//     where: { userId },
//     include: { friend: true },
//   });
// };

// export const createFriendRequest = async (
//   senderId: string,
//   receiverId: string
// ) => {
//   return await prisma.friendRequest.create({
//     data: { senderId, receiverId, status: RequestStatus.PENDING },
//   });
// };

// export const findFriendRequest = async (
//   senderId: string,
//   receiverId: string
// ) => {
//   return await prisma.friendRequest.findFirst({
//     where: { senderId, receiverId },
//   });
// };

// export const findReceivedFriendRequests = async (receiverId: string) => {
//   return await prisma.friendRequest.findMany({
//     where: { receiverId, status: RequestStatus.PENDING },
//     include: {
//       sender: {
//         select: {
//           id: true,
//           username: true,
//           avatar: true,
//         },
//       },
//     },
//   });
// };

// export const searchUsers = async (query: string, excludeUserId: string) => {
//   return await prisma.user.findMany({
//     where: {
//       OR: [
//         { username: { contains: query, mode: "insensitive" } },
//         { email: { contains: query, mode: "insensitive" } },
//       ],
//       NOT: { clerkUserId: excludeUserId },
//     },
//     select: {
//       id: true,
//       username: true,
//       email: true,
//       avatar: true,
//     },
//   });
// };

// export const findFriendIds = async (userId: string) => {
//   return await prisma.friend.findMany({
//     where: { userId },
//     select: { friendId: true },
//   });
// };

// export const findSentFriendRequests = async (
//   senderId: string,
//   receiverIds: string[]
// ) => {
//   return await prisma.friendRequest.findMany({
//     where: {
//       senderId,
//       receiverId: { in: receiverIds },
//     },
//     select: { receiverId: true, status: true },
//   });
// };

// export const findFriendRequestById = async (requestId: string) => {
//   return await prisma.friendRequest.findUnique({
//     where: { id: requestId },
//     include: { sender: true, receiver: true },
//   });
// };

// export const updateFriendRequestStatus = async (
//   requestId: string,
//   status: RequestStatus
// ) => {
//   return await prisma.friendRequest.update({
//     where: { id: requestId },
//     data: { status },
//   });
// };

// export const createFriendship = async (userId: string, friendId: string) => {
//   await prisma.friend.createMany({
//     data: [
//       { userId, friendId },
//       { userId: friendId, friendId: userId },
//     ],
//   });

//   await prisma.friendRequest.updateMany({
//     where: {
//       OR: [
//         { senderId: userId, receiverId: friendId },
//         { senderId: friendId, receiverId: userId },
//       ],
//     },
//     data: { status: RequestStatus.ACCEPTED },
//   });
// };

// export const createDuoConversation = async (
//   user1Id: string,
//   user2Id: string
// ) => {
//   return await prisma.duoConversation.create({
//     data: {
//       user1Id,
//       user2Id,
//     },
//   });
// };

// export const findDuoConversationsForUser = async (
//   userId: string,
//   limit: number,
//   cursor?: Date
// ) => {
//   const conversations = await prisma.duoConversation.findMany({
//     where: {
//       OR: [{ user1Id: userId }, { user2Id: userId }],
//       ...(cursor ? { updatedAt: { lt: cursor } } : {}),
//     },
//     include: {
//       user1: {
//         select: {
//           id: true,
//           username: true,
//           avatar: true,
//         },
//       },
//       user2: {
//         select: {
//           id: true,
//           username: true,
//           avatar: true,
//         },
//       },
//       messages: {
//         orderBy: {
//           timestamp: "desc",
//         },
//         take: 1,
//       },
//     },
//     orderBy: {
//       updatedAt: "desc",
//     },
//     take: limit,
//   });

//   const lastConversation = conversations[conversations.length - 1];
//   const nextCursor = lastConversation?.updatedAt;

//   return {
//     conversations,
//     nextCursor,
//   };
// };

// export const findGroupConversationsForUser = async (
//   userId: string,
//   limit: number,
//   cursor?: Date
// ) => {
//   const conversations = await prisma.groupConversation.findMany({
//     where: {
//       participants: {
//         some: {
//           userId: userId,
//         },
//       },
//       ...(cursor ? { updatedAt: { lt: cursor } } : {}),
//     },
//     include: {
//       participants: {
//         include: {
//           user: {
//             select: {
//               id: true,
//               username: true,
//               avatar: true,
//             },
//           },
//         },
//       },
//       messages: {
//         orderBy: {
//           timestamp: "desc",
//         },
//         take: 1,
//       },
//       groupAdmin: {
//         select: {
//           id: true,
//           username: true,
//           avatar: true,
//         },
//       },
//     },
//     orderBy: {
//       updatedAt: "desc",
//     },
//     take: limit,
//   });

//   const lastConversation = conversations[conversations.length - 1];
//   const nextCursor = lastConversation?.updatedAt;

//   return {
//     conversations,
//     nextCursor,
//   };
// };

// export const findDuoConversationById = async (conversationId: string) => {
//   return await prisma.duoConversation.findUnique({
//     where: { id: conversationId },
//     include: {
//       user1: {
//         select: {
//           id: true,
//           username: true,
//           avatar: true,
//         },
//       },
//       user2: {
//         select: {
//           id: true,
//           username: true,
//           avatar: true,
//         },
//       },
//     },
//   });
// };

// export const findGroupConversationById = async (conversationId: string) => {
//   return await prisma.groupConversation.findUnique({
//     where: { id: conversationId },
//     include: {
//       participants: {
//         include: {
//           user: {
//             select: {
//               id: true,
//               username: true,
//               avatar: true,
//             },
//           },
//         },
//       },
//       groupAdmin: {
//         select: {
//           id: true,
//           username: true,
//           avatar: true,
//         },
//       },
//     },
//   });
// };

// export const fetchMessages = async (
//   conversationId: string,
//   limit: number,
//   cursor?: Date
// ) => {
//   const messages = await prisma.message.findMany({
//     where: {
//       OR: [
//         { duoConversationId: conversationId },
//         { groupConversationId: conversationId },
//       ],
//       ...(cursor ? { timestamp: { lt: cursor } } : {}),
//     },
//     include: {
//       sender: {
//         select: {
//           id: true,
//           username: true,
//           avatar: true,
//         },
//       },
//       seenBy: {
//         select: {
//           userId: true,
//           seenAt: true,
//         },
//       },
//     },
//     orderBy: {
//       timestamp: "desc",
//     },
//     take: limit,
//   });

//   const lastMessage = messages[messages.length - 1];
//   const nextCursor = lastMessage?.timestamp;

//   return {
//     messages,
//     nextCursor,
//   };
// };

// export const createMessage = async (
//   conversationId: string,
//   senderId: string,
//   content: string
// ) => {
//   const duoConversation = await prisma.duoConversation.findUnique({
//     where: { id: conversationId },
//   });

//   const messageData: Prisma.MessageCreateInput = {
//     content,
//     type: "TEXT",
//     sender: { connect: { id: senderId } },
//   };

//   if (duoConversation) {
//     messageData.duoConversation = { connect: { id: conversationId } };
//   } else {
//     messageData.groupConversation = { connect: { id: conversationId } };
//   }

//   const message = await prisma.message.create({
//     data: messageData,
//     include: {
//       sender: {
//         select: {
//           username: true,
//           avatar: true,
//         },
//       },
//     },
//   });

//   return message;
// };

// export const createGroupConversation = async (
//   name: string,
//   groupAdminId: string,
//   participantIds: string[]
// ) => {
//   return await prisma.groupConversation.create({
//     data: {
//       name,
//       groupAdminId,
//       participants: {
//         create: [
//           { userId: groupAdminId, role: GroupRole.ADMIN },
//           ...participantIds.map((id) => ({
//             userId: id,
//             role: GroupRole.MEMBER,
//           })),
//         ],
//       },
//     },
//     include: {
//       participants: {
//         include: {
//           user: {
//             select: {
//               id: true,
//               username: true,
//               avatar: true,
//             },
//           },
//         },
//       },
//       groupAdmin: {
//         select: {
//           id: true,
//           username: true,
//           avatar: true,
//         },
//       },
//     },
//   });
// };

// export const updateGroupParticipantRole = async (
//   groupId: string,
//   userId: string,
//   role: GroupRole
// ) => {
//   return await prisma.groupParticipant.update({
//     where: {
//       userId_groupConversationId: {
//         userId,
//         groupConversationId: groupId,
//       },
//     },
//     data: { role },
//   });
// };

// export const searchFriends = async (
//   userId: string,
//   query: string,
//   limit: number = 10
// ) => {
//   return await prisma.friend.findMany({
//     where: {
//       userId,
//       friend: {
//         OR: [
//           { username: { contains: query, mode: "insensitive" } },
//           { email: { contains: query, mode: "insensitive" } },
//         ],
//       },
//     },
//     include: {
//       friend: {
//         select: {
//           id: true,
//           username: true,
//           email: true,
//           avatar: true,
//         },
//       },
//     },
//     take: limit,
//   });
// };
