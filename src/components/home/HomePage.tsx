"use client";
import React, { useContext } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, Search, Send, Smile, ArrowLeft } from "lucide-react";
import SearchUser from "@/components/searchUsers/SearchUser";
import { UserContext } from "@/store/ContextProvider";
import { signOut } from "next-auth/react";
import { friendListType } from "@/app/page";
import { loggedInUserType } from "@/store/ContextProvider";

const HomePage = ({
  friendsList,
  loggedInUserData,
}: {
  friendsList: friendListType[];
  loggedInUserData: loggedInUserType;
}) => {
  const { selectedUser, setLoggedInUser } = useContext(UserContext);
  setLoggedInUser(loggedInUserData);
  return (
    <>
      {/* <div className={`w-full lg:w-80 border-r border-gray-700 flex flex-col `}> */}
      <div
        className={`w-full lg:w-80 border-r border-gray-700 flex flex-col ${
          selectedUser ? "hidden lg:flex" : "flex"
        }`}
      >
        <div className="p-4 flex justify-between items-center border-b border-gray-700">
          <h1 className="text-xl font-bold">ChatSphere</h1>
          <Button variant="ghost" size="icon">
            <LogOut className="h-5 w-5" onClick={() => signOut()} />
          </Button>
        </div>
        {/* <div className="p-4"> */}
        <SearchUser friendsList={friendsList} />
        {/* </div> */}
        {/* <div className="flex-1 overflow-hidden"> */}
        {/*   <DisplayContacts friendsList={friendsList} /> */}
        {/* </div> */}
      </div>
    </>
  );
};

export default HomePage;
