import { RequestStatus } from "@prisma/client";

export interface Friend {
  id: string;
  createdAt: Date;
  clerkUserId: string;
  username: string;
  avatar: string;
  email: string;
  updatedAt: Date;
}

export interface PaginatedFriendsResponse {
  friends: Friend[];
  totalPages: number;
  currentPage: number;
}

export type GetFriendsResponse =
  | PaginatedFriendsResponse
  | {
      error: {
        message: string;
      };
    };

export interface FriendRequest {
  id: string;
  senderId: string;
  receiverId: string;
  status: RequestStatus;
  createdAt: Date;
  updatedAt: Date;
  sender: {
    id: string;
    username: string;
    avatar: string;
  };
}

export interface PaginatedFriendRequestsResponse {
  requests: FriendRequest[];
  totalPages: number;
  currentPage: number;
}

export type GetFriendRequestsResponse =
  | PaginatedFriendRequestsResponse
  | {
      error: {
        message: string;
      };
    };
