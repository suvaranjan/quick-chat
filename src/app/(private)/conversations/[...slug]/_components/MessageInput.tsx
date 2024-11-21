"use client";

import { useState } from "react";
import { useChat } from "./ChatContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";

export function MessageInput() {
  const [inputValue, setInputValue] = useState("");
  const { sendMessage } = useChat();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    await sendMessage(inputValue.trim());
    setInputValue("");
  };

  return (
    <div className="p-4 border-t sticky bottom-0 bg-background">
      <form className="flex space-x-2" onSubmit={handleSubmit}>
        <Input
          className="flex-1"
          placeholder="Type a message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <Button type="submit" size="icon" disabled={inputValue.length === 0}>
          <ArrowTopRightIcon className="h-4 w-4" />
          <span className="sr-only">Send message</span>
        </Button>
      </form>
    </div>
  );
}
