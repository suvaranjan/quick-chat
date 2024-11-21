"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function SearchForm({
  initialQuery = "",
}: {
  initialQuery?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) {
      params.set("query", query);
    }
    router.push(`/friends/add?${params.toString()}`, { scroll: false });
  };

  return (
    <>
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-5">
          <p className="text-muted-foreground mb-1 text-xs ml-2">
            Search users to send friend request.
          </p>
          <form onSubmit={handleSubmit} className="flex items-center space-x-2">
            <Input
              type="search"
              placeholder="Search Users.."
              className="flex-grow"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button type="submit" size="icon" disabled={query.length == 0}>
              <MagnifyingGlassIcon className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
