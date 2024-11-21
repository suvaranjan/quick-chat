"use client";

import { useRouter, useSearchParams } from "next/navigation";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import UserCard from "./UserCard";

type User = {
  isFriend: boolean;
  isSent: boolean;
  id: string;
  email: string;
  username: string;
  avatar: string;
};

interface UserListProps {
  users: User[];
  totalPages: number;
  currentPage: number;
}

export default function UserList({
  users,
  totalPages,
  currentPage,
}: UserListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    router.push(`/friends/add?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex flex-col h-full w-full">
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-4">
          {users.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      </ScrollArea>

      {totalPages > 0 && (
        <div className="p-4 border-t">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                {currentPage > 1 ? (
                  <PaginationPrevious
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="cursor-pointer"
                  />
                ) : (
                  <Button
                    variant="outline"
                    className="cursor-not-allowed opacity-50"
                    disabled
                  >
                    Previous
                  </Button>
                )}
              </PaginationItem>
              {[...Array(totalPages)].map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    onClick={() => handlePageChange(i + 1)}
                    isActive={currentPage === i + 1}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                {currentPage < totalPages ? (
                  <PaginationNext
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="cursor-pointer"
                  />
                ) : (
                  <Button
                    variant="outline"
                    className="cursor-not-allowed opacity-50"
                    disabled
                  >
                    Next
                  </Button>
                )}
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
