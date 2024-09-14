"use client";
import React, { createContext } from "react";

export type contextUserType = {
  username: string;
  image?: string;
  id: number | string;
  type: "search" | "friend";
  group: boolean;
  socketId: string;
};

export type loggedInUserType = {
  username: string;
  image?: string;
  id: number;
};

export type contextChatType = {
  id?: string;
  status?: string;
  senderId: number;
  content: string;
  createdAt: string;
  groupChat?: boolean;
  senderUsername: string;
  senderProfilePic: string | null;
};

export type contextFriendListType = {
  username: string;
  id: number | string;
  image?: string;
  isGroup?: boolean;
  lastMessage?: string;
  unseenMsgCount?: number;
  socketId: string;
};

type selectedUserType = {
  selectedUser: contextUserType | null;
  setSelectedUser: React.Dispatch<React.SetStateAction<contextUserType | null>>;
  selectedChat: contextChatType[];
  setSelectedChat: React.Dispatch<React.SetStateAction<contextChatType[]>>;
  loggedInUser: loggedInUserType | null;
  setLoggedInUser: React.Dispatch<
    React.SetStateAction<loggedInUserType | null>
  >;
  friendsList: contextFriendListType[];
  setFriendsList: React.Dispatch<React.SetStateAction<contextFriendListType[]>>;
};

export const UserContext = createContext<selectedUserType>({
  selectedUser: null,
  setSelectedUser: () => {},
  selectedChat: [],
  setSelectedChat: () => {},
  loggedInUser: null,
  setLoggedInUser: () => {},
  friendsList: [],
  setFriendsList: () => {},
});

export const UserContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedUser, setSelectedUser] =
    React.useState<contextUserType | null>(null);
  const [selectedChat, setSelectedChat] = React.useState<contextChatType[]>([]);
  const [loggedInUser, setLoggedInUser] =
    React.useState<loggedInUserType | null>(null);
  const [friendsList, setFriendsList] = React.useState<contextFriendListType[]>(
    [],
  );

  return (
    <UserContext.Provider
      value={{
        selectedUser,
        setSelectedUser,
        selectedChat,
        setSelectedChat,
        loggedInUser,
        setLoggedInUser,
        friendsList,
        setFriendsList,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
