import { Suspense } from "react";
import { searchUsersToAddFriend } from "@/actions/friend";
import SearchForm from "../_components/SearchForm";
import UserList from "../_components/UserList";
import { Loader2 } from "lucide-react";
import ErrorCard from "@/components/mycomps/ErrorCard";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function FriendAddPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const resolvedSearchParams = await searchParams;
  const page = resolvedSearchParams.page ?? "1";
  const query = resolvedSearchParams.query ?? "";
  const currentPage = parseInt(Array.isArray(page) ? page[0] : page, 10);
  const searchQuery = Array.isArray(query) ? query[0] : query;

  return (
    <div className="flex flex-col px-4 space-y-4 h-full">
      <SearchForm initialQuery={searchQuery} />
      {searchQuery.length !== 0 && (
        <Suspense
          key={`${currentPage}-${searchQuery}`}
          fallback={<SearchFallback />}
        >
          <Users currentPage={currentPage} query={searchQuery} />
        </Suspense>
      )}
    </div>
  );
}

async function Users({
  currentPage,
  query,
}: {
  currentPage: number;
  query: string;
}) {
  const pageSize = 10;
  const userData = await searchUsersToAddFriend(query, currentPage, pageSize);

  if ("error" in userData) {
    return <ErrorCard message={userData.error.message} />;
  }

  if (userData.results.length === 0) {
    return (
      <p className="text-center text-muted-foreground mt-5 text-sm">
        No users found.
      </p>
    );
  }

  return (
    <UserList
      users={userData.results}
      totalPages={userData.totalPages}
      currentPage={userData.currentPage}
    />
  );
}

function SearchFallback() {
  return (
    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
      <Loader2 className="animate-spin size-4" />
      <p>Searching ...</p>
    </div>
  );
}
