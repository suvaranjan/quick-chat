"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { RequestStatus } from "@prisma/client";
import {
  // findFriends,
  findFriendRequest,
  createFriendRequest,
  // findReceivedFriendRequests,
  findFriendIds,
  findSentFriendRequests,
  findFriendRequestById,
  updateFriendRequestStatus,
  createFriendship,
  searchFriends as searchFriendsRepo,
  findFriendsPaginated,
  findFriendRequestsPaginated,
} from "@/db/functions/friend";

import {
  findUserByClerkId,
  //  searchUsers,
  searchUsersPaginated,
} from "@/db/functions/user";
import { createDuoConversation } from "@/db/functions/conversation";
import {
  GetFriendRequestsResponse,
  GetFriendsResponse,
} from "@/types/friendsTypes";
import { SearchUsersResponse } from "@/types/userTypes";

// export async function getFriends() {
//   const { userId } = await auth();
//   if (!userId) return { error: { message: "Not authenticated" } };

//   try {
//     const loggedInUser = await findUserByClerkId(userId);
//     if (!loggedInUser) return { error: { message: "User not found" } };

//     const friendsRecord = await findFriends(loggedInUser.id);
//     const userFriends = friendsRecord.map((f) => f.friend);
//     return userFriends;
//   } catch (error) {
//     console.error("Error getting friends:", error);
//     return { error: { message: "Failed to get friends" } };
//   }
// }

export async function getFriends(
  page: number = 1,
  pageSize: number = 10
): Promise<GetFriendsResponse> {
  const { userId } = await auth();
  if (!userId) return { error: { message: "Not authenticated" } };

  try {
    const loggedInUser = await findUserByClerkId(userId);
    if (!loggedInUser) return { error: { message: "User not found" } };

    const { friends, totalPages, currentPage } = await findFriendsPaginated(
      loggedInUser.id,
      page,
      pageSize
    );
    return { friends, totalPages, currentPage };
  } catch (error) {
    console.error("Error getting friends:", error);
    return { error: { message: "Failed to get friends" } };
  }
}

export async function sendFriendRequest(friendId: string) {
  const { userId } = await auth();
  if (!userId) return { error: { message: "Not authenticated" } };

  try {
    const loggedInUser = await findUserByClerkId(userId);
    if (!loggedInUser) return { error: { message: "User not found" } };

    const existingRequest = await findFriendRequest(loggedInUser.id, friendId);

    if (existingRequest) {
      if (existingRequest.status === RequestStatus.PENDING) {
        return { error: { message: "Friend Request Already Sent" } };
      } else if (existingRequest.status === RequestStatus.ACCEPTED) {
        return { error: { message: "Already Friends" } };
      } else if (existingRequest.status === RequestStatus.REJECTED) {
        // Update the existing rejected request to pending
        await updateFriendRequestStatus(
          existingRequest.id,
          RequestStatus.PENDING
        );
        revalidatePath("/friends/add");
        return { success: true, message: "Friend request sent successfully" };
      }
    }

    // If no existing request, create a new one
    await createFriendRequest(loggedInUser.id, friendId);

    revalidatePath("/friends/add");
    return { success: true, message: "Friend request sent successfully" };
  } catch (error) {
    console.error("Error sending friend request:", error);
    return { error: { message: "Failed to send friend request" } };
  }
}

// export async function getFriendRequests() {
//   const { userId } = await auth();
//   if (!userId) return { error: { message: "Not authenticated" } };

//   try {
//     const loggedInUser = await findUserByClerkId(userId);
//     if (!loggedInUser) return { error: { message: "User not found" } };

//     const requests = await findReceivedFriendRequests(loggedInUser.id);

//     // Simulating wait (you may want to remove this in production)
//     await new Promise((resolve) => setTimeout(resolve, 2000));

//     return requests;
//   } catch (error) {
//     console.error("Error getting friend requests:", error);
//     return { error: { message: "Failed to get friend requests" } };
//   }
// }

export async function getFriendRequests(
  page: number = 1,
  pageSize: number = 10
): Promise<GetFriendRequestsResponse> {
  const { userId } = await auth();
  if (!userId) return { error: { message: "Not authenticated" } };

  try {
    const loggedInUser = await findUserByClerkId(userId);
    if (!loggedInUser) return { error: { message: "User not found" } };

    const { requests, totalPages, currentPage } =
      await findFriendRequestsPaginated(loggedInUser.id, page, pageSize);
    return { requests, totalPages, currentPage };
  } catch (error) {
    console.error("Error getting friend requests:", error);
    return { error: { message: "Failed to get friend requests" } };
  }
}

// export async function searchUsersToAddFriend(query: string) {
//   const { userId } = await auth();
//   if (!userId) return { error: { message: "Not authenticated" } };

//   if (!query || query.trim() === "") {
//     return { error: { message: "Query cannot be empty" } };
//   }

//   try {
//     const loggedInUser = await findUserByClerkId(userId);
//     if (!loggedInUser) return { error: { message: "User not found" } };

//     const users = await searchUsers(query, userId);

//     const friendIds = new Set(
//       (await findFriendIds(loggedInUser.id)).map((f) => f.friendId)
//     );

//     const sentFriendRequests = new Set(
//       (
//         await findSentFriendRequests(
//           loggedInUser.id,
//           users.map((user) => user.id)
//         )
//       ).map((request) => request.receiverId)
//     );

//     const results = users.map((user) => ({
//       ...user,
//       isFriend: friendIds.has(user.id),
//       isSent: sentFriendRequests.has(user.id),
//     }));

//     return results;
//   } catch (error) {
//     console.error("Error searching users:", error);
//     return { error: { message: "Failed to search users" } };
//   }
// }

export async function searchUsersToAddFriend(
  query: string,
  page: number = 1,
  pageSize: number = 10
): Promise<SearchUsersResponse> {
  const { userId } = await auth();
  if (!userId) return { error: { message: "Not authenticated" } };

  if (!query || query.trim() === "") {
    return { error: { message: "Query cannot be empty" } };
  }

  try {
    const loggedInUser = await findUserByClerkId(userId);
    if (!loggedInUser) return { error: { message: "User not found" } };

    const { users, totalPages, currentPage } = await searchUsersPaginated(
      query,
      userId,
      page,
      pageSize
    );

    const friendIds = new Set(
      (await findFriendIds(loggedInUser.id)).map((f) => f.friendId)
    );

    const sentFriendRequests = await findSentFriendRequests(
      loggedInUser.id,
      users.map((user) => user.id)
    );

    const sentRequestsMap = new Map(
      sentFriendRequests.map((request) => [request.receiverId, request.status])
    );

    const results = users.map((user) => ({
      ...user,
      isFriend: friendIds.has(user.id),
      isSent: sentRequestsMap.get(user.id) === RequestStatus.PENDING,
    }));

    return { results, totalPages, currentPage };
  } catch (error) {
    console.error("Error searching users:", error);
    return { error: { message: "Failed to search users" } };
  }
}

export async function acceptFriendRequest(requestId: string) {
  const { userId } = await auth();
  if (!userId) return { error: { message: "Not authenticated" } };

  try {
    const loggedInUser = await findUserByClerkId(userId);
    if (!loggedInUser) return { error: { message: "User not found" } };

    const friendRequest = await findFriendRequestById(requestId);
    if (!friendRequest)
      return { error: { message: "Friend request not found" } };

    if (friendRequest.receiverId !== loggedInUser.id) {
      return { error: { message: "Unauthorized to accept this request" } };
    }

    // Update friend request status to ACCEPTED
    await updateFriendRequestStatus(requestId, RequestStatus.ACCEPTED);

    // Create friendship
    await createFriendship(loggedInUser.id, friendRequest.senderId);

    // Create a DuoConversation
    await createDuoConversation(loggedInUser.id, friendRequest.senderId);

    revalidatePath("/friends");
    revalidatePath("/friends/requests");
    return { success: true };
  } catch (error) {
    console.error("Error accepting friend request:", error);
    return { error: { message: "Failed to accept friend request" } };
  }
}

export async function rejectFriendRequest(requestId: string) {
  const { userId } = await auth();
  if (!userId) return { error: { message: "Not authenticated" } };

  try {
    const loggedInUser = await findUserByClerkId(userId);
    if (!loggedInUser) return { error: { message: "User not found" } };

    const friendRequest = await findFriendRequestById(requestId);
    if (!friendRequest)
      return { error: { message: "Friend request not found" } };

    if (friendRequest.receiverId !== loggedInUser.id) {
      return { error: { message: "Unauthorized to reject this request" } };
    }

    // Update friend request status to REJECTED instead of deleting
    await updateFriendRequestStatus(requestId, RequestStatus.REJECTED);

    revalidatePath("/friends");
    revalidatePath("/friends/requests");
    return { success: true };
  } catch (error) {
    console.error("Error rejecting friend request:", error);
    return { error: { message: "Failed to reject friend request" } };
  }
}

export async function searchFriends(query: string) {
  const { userId } = await auth();
  if (!userId) return { error: { message: "Not authenticated" } };

  if (!query || query.trim() === "") {
    return { error: { message: "Query cannot be empty" } };
  }

  try {
    const loggedInUser = await findUserByClerkId(userId);
    if (!loggedInUser) return { error: { message: "User not found" } };

    const friendsResult = await searchFriendsRepo(loggedInUser.id, query);

    const friends = friendsResult.map((fr) => fr.friend);

    return { data: friends };
  } catch (error) {
    console.error("Error searching friends:", error);
    return { error: { message: "Failed to search friends" } };
  }
}
