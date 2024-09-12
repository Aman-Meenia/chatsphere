"use client";
import React from "react";
import { useContext } from "react";
import { contextUserType, UserContext } from "@/store/ContextProvider";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { friendListType } from "@/app/page";

const DisplaySearchUser = ({ friends }: { friends: friendListType }) => {
  // console.log("FRIENDS: ", friends);

  const { setSelectedUser, selectedUser } = useContext(UserContext);
  let username = friends.username.toLowerCase();
  username = username.charAt(0).toUpperCase() + username.slice(1);

  const setSelectedUserValue = (e: React.MouseEvent) => {
    // console.log("Selected User is " + selectedUser);
    e.preventDefault();
    const User: contextUserType = {
      username: friends.username,
      id: friends.id,
      type: "search",
      group: false,
    };
    // console.log(User);
    setSelectedUser(User);
  };
  return (
    <div
      key={friends.id}
      className="flex items-center gap-3 p-4 hover:bg-gray-700 cursor-pointer transition-colors duration-200"
      onClick={setSelectedUserValue}
    >
      <Avatar>
        <AvatarImage src={friends.username} alt={friends.username[0]} />
        <AvatarFallback>{friends.username[0].toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline">
          <p className="text-sm font-medium truncate">{username}</p>
        </div>
      </div>
    </div>
  );
};

export default DisplaySearchUser;
