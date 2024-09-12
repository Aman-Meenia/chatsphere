import React, { useContext, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserContext } from "@/store/ContextProvider";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Message = () => {
  const { selectedChat, selectedUser, loggedInUser } = useContext(UserContext);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]",
      );
      if (scrollElement instanceof HTMLElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [selectedChat]);

  const getInitial = (username: string) => {
    console.log(username);
    return username.charAt(0).toUpperCase();
  };

  return (
    <ScrollArea
      ref={scrollAreaRef}
      className="flex-1 p-4 h-[calc(100vh-200px)]"
    >
      {selectedChat &&
        selectedChat.map((message) => {
          console.log(message);
          const isCurrentUser =
            Number(message?.senderId) === Number(loggedInUser?.id);

          return (
            <div
              key={message.id}
              className={`mb-4 flex items-end ${
                isCurrentUser ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <Avatar className={`${isCurrentUser ? "ml-2" : "mr-2"} h-8 w-8`}>
                <AvatarFallback
                  className={`text-xs ${
                    isCurrentUser ? "bg-blue-600" : "bg-gray-700"
                  }`}
                >
                  {getInitial(message.senderUsername)}
                </AvatarFallback>
              </Avatar>
              <div
                className={`inline-block p-2 rounded-lg max-w-[70%] ${
                  isCurrentUser ? "bg-blue-600" : "bg-gray-700"
                }`}
              >
                <p className="break-all whitespace-pre-wrap overflow-wrap-anywhere">
                  {message?.content}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {formatDate(message?.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
    </ScrollArea>
  );
};

export default Message;

function formatDate(isoDateString: string): string {
  const date = new Date(isoDateString);

  if (isNaN(date.getTime())) {
    throw new Error("Invalid date string");
  }

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const day = date.getDate().toString().padStart(2, "0");
  const month = months[date.getMonth()];
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  const today = new Date();

  if (date.toDateString() === today.toDateString()) {
    return `${hours}:${minutes}`;
  } else {
    return `${day} ${month} ${hours}:${minutes}`;
  }
}
