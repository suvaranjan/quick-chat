"use client";

import { useRouter, useSearchParams } from "next/navigation";
import RequestCard from "./RequestCard";
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
import { PaginatedFriendRequestsResponse } from "@/types/friendsTypes";

interface RequestListProps {
  initialData: PaginatedFriendRequestsResponse;
}

export default function RequestList({ initialData }: RequestListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    router.push(`/requests?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-4">
          {initialData.requests.map((request) => (
            <RequestCard key={request.id} request={request} />
          ))}
        </div>
      </ScrollArea>
      {initialData.totalPages > 0 && (
        <div className="p-4 border-t">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                {initialData.currentPage > 1 ? (
                  <PaginationPrevious
                    onClick={() =>
                      handlePageChange(initialData.currentPage - 1)
                    }
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
              {[...Array(initialData.totalPages)].map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    onClick={() => handlePageChange(i + 1)}
                    isActive={initialData.currentPage === i + 1}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                {initialData.currentPage < initialData.totalPages ? (
                  <PaginationNext
                    onClick={() =>
                      handlePageChange(initialData.currentPage + 1)
                    }
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
