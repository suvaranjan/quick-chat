import { Suspense } from "react";
import { getFriends } from "@/actions/friend";
import FriendsList from "./_components/FriendList";
import FriendsLoading from "./_components/FriendsLoading";
import { PaginatedFriendsResponse } from "@/types/friendsTypes";
import ErrorCard from "@/components/mycomps/ErrorCard";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function FriendsPage(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;
  const page = searchParams.page ?? "1";
  const currentPage = parseInt(Array.isArray(page) ? page[0] : page, 10);

  return (
    <Suspense fallback={<FriendsLoading required={6} />}>
      <FriendsData currentPage={currentPage} />
    </Suspense>
  );
}

async function FriendsData({ currentPage }: { currentPage: number }) {
  const pageSize = 10;
  const friendsData = await getFriends(currentPage, pageSize);

  if ("error" in friendsData) {
    return <ErrorCard message={friendsData.error.message} />;
  }

  if (friendsData.friends.length == 0) {
    return (
      <p className="text-center text-muted-foreground mt-5 text-sm">
        No friends found.
      </p>
    );
  }

  return <FriendsList initialData={friendsData as PaginatedFriendsResponse} />;
}
