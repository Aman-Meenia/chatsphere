"use client";
import React, { useContext } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { contextUserType, UserContext } from "@/store/ContextProvider";
import { friendListType } from "@/app/page";

const DisplayContact = ({ friends }: { friends: friendListType }) => {
  const { setSelectedUser, selectedUser } = useContext(UserContext);

  const setSelectedUserValue = (e: React.MouseEvent) => {
    e.preventDefault();
    const User: contextUserType = {
      username: friends.username,
      id: friends.id,
      type: "friend",
      group: false,
      socketId: friends.socketId,
    };
    if (friends.isGroup) {
      User.group = true;
    }
    friends.unseenMsgCount = 0;
    console.log("New User Selected ");
    console.log(User);
    setSelectedUser(User);
  };

  if (!friends.unseenMsgCount) friends.unseenMsgCount = 0;
  if (!friends.lastMessage) friends.lastMessage = "";

  const truncateMessage = (message: string) => {
    if (message && message.length > 30) {
      return message.slice(0, 30) + "...";
    }
    return message;
  };

  const getFirstCharacterOfNameUppercase = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  const isSelected = selectedUser && selectedUser.id === friends.id;

  return (
    <div
      key={friends.id}
      className={`flex items-center gap-3 p-4 cursor-pointer transition-all duration-200 ${
        isSelected
          ? "bg-gray-700 hover:bg-gray-700 p-[17px]"
          : "hover:bg-gray-700"
      } mb-2 rounded-lg`}
      onClick={setSelectedUserValue}
    >
      <Avatar>
        <AvatarImage src={friends.username} alt={friends.username[0]} />
        <AvatarFallback>{friends.username[0].toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline">
          <p className="text-sm font-medium truncate">
            {getFirstCharacterOfNameUppercase(friends?.username)}
          </p>
        </div>
        <p className="text-sm text-gray-400 truncate">
          {truncateMessage(friends?.lastMessage)}
        </p>
      </div>
      {friends?.unseenMsgCount > 0 && (
        <div className="bg-green-500 text-xs rounded-full px-2 py-1">
          {friends?.unseenMsgCount}
        </div>
      )}
    </div>
  );
};

export default DisplayContact;
