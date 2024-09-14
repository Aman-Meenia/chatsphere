"use client";

import { useContext, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft } from "lucide-react";
import MessageBox from "./MessageBox";
import Message from "./Message";
import { useSession } from "next-auth/react";

import axios from "axios";
import { UserContext } from "@/store/ContextProvider";

// type contextUserType = {
//   username: string;
//   id: number;
//   type: string;
//   avatar?: string;
//   name?: string;
// };

const Messages = () => {
  const { selectedUser, setSelectedChat, setSelectedUser } =
    useContext(UserContext);
  const session = useSession();

  const domain = process.env.NEXT_PUBLIC_DOMAIN;
  async function getMessages() {
    // console.log("SENDE ID IS " + session.data?.user?.id);
    // console.log("Slected user Id " + selectedUser?.id);
    // console.log(selectedUser);

    const messageType =
      selectedUser?.group === true ? "group-messages" : "messages";
    if (messageType === "group-messages") {
      // console.log("UserId " + session?.data?.user?.id);
      // console.log(selectedUser?.id);
      const res = await axios
        .post(`${domain}/api/${messageType}`, {
          userId: Number(session?.data?.user?.id),
          groupId: selectedUser?.id,
        })
        .then((res) => {
          // console.log("RESPONS ");
          // console.log(res);
          return res.data;
        })
        .catch((res) => {
          return res.data;
        });
      // console.log(res);
      return res;
    } else {
      const res = await axios
        .post(`${domain}/api/${messageType}`, {
          senderId: Number(session?.data?.user?.id),
          receiverId: Number(selectedUser?.id),
        })
        .then((res) => {
          if (res.data.success === true) {
            return res.data;
          }
          return res.data;
        })
        .catch((err) => {
          return err.response.data;
        });
      return res;
    }
  }

  useEffect(() => {
    async function fetchMessages() {
      const res = await getMessages();
      // console.log("RES ");
      // console.log(res);
      if (res?.success === true) {
        // console.log("RESPONSE IS THE  ");
        // console.log(res);
        // console.log(res?.messages[0]?.allChats);
        setSelectedChat(res?.messages[0]?.allChats);
      } else {
        //TODO: handle when we get error while fetching messages
      }
    }
    fetchMessages();
  }, [selectedUser, setSelectedChat]);

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-700 flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setSelectedUser(null)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Avatar>
          <AvatarImage src={selectedUser?.image} alt={selectedUser?.username} />
          <AvatarFallback>
            {selectedUser?.username[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-semibold">{selectedUser?.username}</h2>
          <p className="text-sm text-gray-400">Last seen</p>
        </div>
      </div>

      {/* <ScrollArea className="flex-grow p-4"> */}
      <Message />
      {/* </ScrollArea> */}

      <MessageBox />
    </div>
  );
};

export default Messages;
