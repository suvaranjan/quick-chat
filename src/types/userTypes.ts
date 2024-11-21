export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  isFriend: boolean;
  isSent: boolean;
}

export interface PaginatedUsersResponse {
  results: User[];
  totalPages: number;
  currentPage: number;
}

export type SearchUsersResponse =
  | PaginatedUsersResponse
  | {
      error: {
        message: string;
      };
    };
