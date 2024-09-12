"use client";
import React, { createContext } from "react";

export type contextUserType = {
  username: string;
  image?: string;
  id: number | string;
  type: "search" | "friend";
  group: boolean;
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

type selectedUserType = {
  selectedUser: contextUserType | null;
  setSelectedUser: React.Dispatch<React.SetStateAction<contextUserType | null>>;
  selectedChat: contextChatType[];
  setSelectedChat: React.Dispatch<React.SetStateAction<contextChatType[]>>;
  loggedInUser: loggedInUserType | null;
  setLoggedInUser: React.Dispatch<
    React.SetStateAction<loggedInUserType | null>
  >;
};

export const UserContext = createContext<selectedUserType>({
  selectedUser: null,
  setSelectedUser: () => {},
  selectedChat: [],
  setSelectedChat: () => {},
  loggedInUser: null,
  setLoggedInUser: () => {},
});

export const UserContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedUser, setSelectedUser] =
    React.useState<contextUserType | null>(null);
  const [selectedChat, setSelectedChat] = React.useState<contextChatType[]>([]);
  const [loggedInUser, setLoggedInUser] =
    React.useState<loggedInUserType | null>(null);

  return (
    <UserContext.Provider
      value={{
        selectedUser,
        setSelectedUser,
        selectedChat,
        setSelectedChat,
        loggedInUser,
        setLoggedInUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
