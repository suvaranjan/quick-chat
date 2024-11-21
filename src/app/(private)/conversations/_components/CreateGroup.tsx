"use client";

import { useState } from "react";
import { Loader2, Search, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { searchFriends } from "@/actions/friend";
import { createGroupConversation } from "@/actions/chat";
import { toast } from "sonner";

interface User {
  id: string;
  username: string;
  avatar: string;
}

interface CreateGroupSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateGroupSheet({
  isOpen,
  onOpenChange,
}: CreateGroupSheetProps) {
  const [groupName, setGroupName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [addedMembers, setAddedMembers] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  //   const { toast } = useToast();

  // Handles adding members
  const handleAddMember = (user: User) => {
    setAddedMembers((prev) => [...prev, user]);
    setSearchResults((prev) => prev.filter((u) => u.id !== user.id));
  };

  // Handles removing members
  const handleRemoveMember = (userId: string) => {
    const removedUser = addedMembers.find((u) => u.id === userId);
    setAddedMembers((prev) => prev.filter((u) => u.id !== userId));
    if (removedUser) setSearchResults((prev) => [...prev, removedUser]);
  };

  // Fetch search results from API
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const result = await searchFriends(searchQuery);
      if (result.error) {
        alert(result.error);
        return;
      }

      // Filter out already added members
      const filteredResults = result.data.filter(
        (user) => !addedMembers.some((member) => member.id === user.id)
      );
      setSearchResults(filteredResults);
    } catch (error) {
      console.log(error);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle search input with debouncing
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value.trim()) {
      const timeoutId = setTimeout(() => {
        handleSearch();
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  };

  // Handles creating a group
  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!groupName.trim()) {
      return;
    }

    if (addedMembers.length === 0) {
      return;
    }

    setIsCreating(true);
    try {
      const formData = new FormData();
      formData.append("groupName", groupName);
      formData.append("members", JSON.stringify(addedMembers));

      const result = await createGroupConversation(formData);

      if (result.error) {
        alert(result.error);
        return;
      }

      toast.success("Group Created");

      onOpenChange(false);
      setGroupName("");
      setAddedMembers([]);
      setSearchResults([]);
      setSearchQuery("");
    } catch (error) {
      console.log(error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="top" className="w-full sm:mx-auto">
        <SheetHeader>
          <SheetTitle className="text-center">Create New Group</SheetTitle>
        </SheetHeader>
        <div className="max-w-md mx-auto">
          <form onSubmit={handleCreateGroup} className="space-y-4 mt-4">
            <Input
              placeholder="Group Name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full"
            />

            <div className="flex space-x-2 relative">
              <Input
                placeholder="Search friends to add"
                value={searchQuery}
                onChange={handleSearchInput}
                className="flex-grow pl-12"
              />
              {!isSearching && (
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              )}

              {isSearching && (
                <Loader2 className="absolute left-3 bottom-2 text-muted-foreground h-4 w-4 animate-spin" />
              )}
            </div>

            {searchResults.length > 0 && (
              <ScrollArea className="space-y-2 max-h-[200px] p-2">
                {searchResults.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-2 bg-secondary rounded-md mb-2"
                  >
                    <div className="flex items-center space-x-2">
                      <Avatar>
                        <AvatarImage src={user.avatar} alt={user.username} />
                        <AvatarFallback>
                          {user.username[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span>{user.username}</span>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => handleAddMember(user)}
                    >
                      Add
                    </Button>
                  </div>
                ))}
              </ScrollArea>
            )}

            {addedMembers.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Added Members:</h3>
                <div className="flex flex-wrap gap-2">
                  {addedMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center space-x-2 bg-primary text-primary-foreground rounded-full px-3 py-1"
                    >
                      <span className="text-xs">{member.username}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(member.id)}
                        className="text-primary-foreground hover:text-secondary-foreground"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={
                isCreating || !groupName.trim() || addedMembers.length === 0
              }
            >
              {isCreating ? "Creating..." : "Create Group"}
            </Button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
