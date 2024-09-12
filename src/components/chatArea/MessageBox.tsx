"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Send, Smile } from "lucide-react";
import { useContext, useState } from "react";
import { contextChatType, UserContext } from "@/store/ContextProvider";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import axios from "axios";
const MessageBox = () => {
  const [msg, setMsg] = useState<string>("");
  const { selectedUser, setSelectedChat, selectedChat } =
    useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const domain = process.env.NEXT_PUBLIC_DOMAIN;

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (msg.trim().length === 0) {
      toast.error("Please enter a message");
      return;
    }
    const data = {
      content: msg,
      senderId: Number(session?.user?.id),
      receiverId: Number(selectedUser?.id),
    };
    setLoading(true);
    console.log("<--------------Data Sending --------------->");
    console.log(data);

    if (selectedUser?.group === true) {
      await axios
        .post(`${domain}/api/group-message`, {
          groupId: selectedUser?.id,
          userId: data.senderId,
          message: data.content,
        })
        .then((res) => {
          console.log(res.data);
          if (res.data.success === true) {
            // toast.success("Message sent successfully");
            const response: contextChatType = res.data.messages[0];
            console.log(selectedChat);
            if (selectedChat) {
              console.log("Response is the second time group message ");

              setSelectedChat([...selectedChat, response]);
            } else {
              console.log("Response is the first time group message ");
              console.log(response);
              setSelectedChat([response]);
            }
          } else {
            toast.error("Currently unable to send message");
          }
        })
        .catch((err) => {
          console.log("Error " + err.response.data);

          toast.error("Currently unable to send message");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      await axios
        .post(`${domain}/api/message`, {
          senderId: data.senderId,
          receiverId: data.receiverId,
          message: data.content,
        })
        .then((res) => {
          // console.log("REsponse " + res);
          // console.log(res?.data);

          if (res.data.success === true) {
            // toast.success("Message sent successfully");
            const response: contextChatType = res.data.messages[0];
            if (selectedChat) {
              setSelectedChat([...selectedChat, response]);
            } else {
              setSelectedChat([response]);
            }
          } else {
            toast.error(res.data.message);
            toast.error("Currently unable to send message");
          }
        })
        .catch((err) => {
          toast.error("Currently unable to send message");
        })
        .finally(() => {
          setLoading(false);
        });
    }

    setMsg("");
  };

  return (
    <div className="p-4 border-t border-gray-700">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Smile className="h-5 w-5" />
        </Button>
        <Input
          className="flex-1 bg-gray-800 border-gray-700"
          placeholder="Type message"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        />
        <Button size="icon" onClick={handleSubmit} disabled={loading}>
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default MessageBox;
