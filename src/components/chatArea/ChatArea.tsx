"use client";
import React, { useEffect } from "react";
import Messages from "./Messages";
import { useContext } from "react";
import { UserContext } from "@/store/ContextProvider";
import DisplaySearchUserInfo from "../displaySearchUser/DisplaySearchUserInfo";
import { useSession } from "next-auth/react";
import FetchMessages from "./FetchMessages";

const ChatArea = () => {
  const { selectedUser, loggedInUser } = useContext(UserContext);
  // console.log("<----------------------Chat Area----------------------->");
  // console.log("SELECTEDUSER IS: ", selectedUser);
  // console.log(selectedUser);

  // useEffect(() => {
  //   if (selectedUser) {
  //     console.log("SELECTED USER IS: ", selectedUser);
  //   }
  // }, [selectedUser]);

  let userName = loggedInUser?.username;
  if (userName) {
    userName = userName?.charAt(0).toUpperCase() + userName?.slice(1);
  }

  const { data: session } = useSession();
  return (
    <>
      {selectedUser !== null ? (
        selectedUser.type === "friend" ? (
          <div className="flex-1">
            <Messages />
            {/* <FetchMessages /> */}
          </div>
        ) : (
          <DisplaySearchUserInfo />
        )
      ) : (
        <div className="flex-1 hidden lg:flex items-center justify-center flex-col">
          <div className="text-3xl"> Welcome 👋 {userName}</div>
          <div className="text-3xl">Select a chat to start messaging</div>
        </div>
      )}
    </>
  );
};

export default ChatArea;
// <div className="flex w-full justify-center items-center ">
// </div>
