import { Suspense } from "react";
import RequestsLoading from "../_components/RequestsLoading";
import { getFriendRequests } from "@/actions/friend";
import { PaginatedFriendRequestsResponse } from "@/types/friendsTypes";
import RequestList from "../_components/RequestList";
import ErrorCard from "@/components/mycomps/ErrorCard";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function RequestsPage(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const page = searchParams.page ?? "1";
  const currentPage = parseInt(Array.isArray(page) ? page[0] : page, 10);

  return (
    <Suspense fallback={<RequestsLoading required={5} />}>
      <RequestsData currentPage={currentPage} />
    </Suspense>
  );
}

async function RequestsData({ currentPage }: { currentPage: number }) {
  const pageSize = 10;
  const requestsData = await getFriendRequests(currentPage, pageSize);

  console.log(requestsData);

  if ("error" in requestsData) {
    return <ErrorCard message={requestsData.error.message} />;
  }

  if (requestsData.requests.length == 0) {
    return (
      <p className="text-center text-muted-foreground mt-5 text-sm">
        No requests found.
      </p>
    );
  }

  return (
    <RequestList
      initialData={requestsData as PaginatedFriendRequestsResponse}
    />
  );
}
