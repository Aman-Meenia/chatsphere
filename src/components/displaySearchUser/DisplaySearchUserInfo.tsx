"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  UserPlus,
  UserMinus,
  Check,
  MessageSquare,
  Loader2,
  X,
} from "lucide-react";
import { useContext } from "react";
import { UserContext } from "@/store/ContextProvider";
import axios from "axios";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
const domain = process.env.NEXT_PUBLIC_DOMAIN;

export default function DisplaySearchUserInfo() {
  const { selectedUser, setSelectedUser } = useContext(UserContext);
  let userName = selectedUser?.username;
  if (userName) userName = userName.charAt(0).toUpperCase() + userName.slice(1);

  const user = {
    username: userName,
    id: selectedUser?.id,
    profilePic: selectedUser?.image,
    // "https://cdn.pixabay.com/photo/2023/11/09/19/36/zoo-8378189_1280.jpg",
  };
  const [friendshipStatus, setFriendshipStatus] = useState<
    "not_friends" | "request_sent" | "request_received" | "friends" | null
  >(null);

  const [requestLoading, setRequestLoading] = useState(false);

  const { data: session } = useSession();
  // console.log("SESSION DATA ");
  // console.log(session);

  const [loading, setLoading] = useState(false);
  const fetchFriendshipStatus = async (id: number) => {
    setLoading(true);
    await axios
      .post(`${domain}/api/users/friendship-status`, {
        id: selectedUser?.id,
        loginUserId: id,
      })
      .then((response) => {
        // console.log("<-----------------FriendShip status------------------>");
        // console.log(response.data);
        setFriendshipStatus(response?.data?.messages[0]?.friendshipStatus);
      })
      .catch((err) => {
        // console.log("<-----------------FriendShip status------------------>");
        // console.log(err.response.data);
        toast.error("Error while fetching friendship status");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (selectedUser) {
      if (typeof selectedUser?.id === "number")
        fetchFriendshipStatus(selectedUser?.id);
    }
  }, [selectedUser]);

  // Accept request api call
  const handleAcceptRequest = async (e: any) => {
    e.preventDefault();
    setRequestLoading(true);
    await axios
      .post(`${domain}/api/accept-request`, {
        senderId: Number(selectedUser?.id),
        receiverId: Number(session?.user?.id),
      })
      .then((response) => {
        if (response?.data?.success === true) {
          // console.log(response.data);
          setFriendshipStatus("friends");
          toast.success("Request accepted successfully");
        } else {
          toast.success("Error while accepting request");
        }
      })
      .catch((err) => {
        // console.log(err.response.data);
        toast.error("Error while accepting request");
      })
      .finally(() => {
        setRequestLoading(false);
      });
  };
  // Withdraw request api call

  const handleWithdrawRequest = async (e: any) => {
    setRequestLoading(true);
    await axios
      .post(`${domain}/api/withdraw-request`, {
        senderId: Number(session?.user?.id),
        receiverId: Number(selectedUser?.id),
      })
      .then((response) => {
        if (response?.data?.success === true) {
          // console.log(response.data);
          setFriendshipStatus("not_friends");
          toast.success("Request withdraw successfully");
        } else {
          // console.log(response.data);
          toast.error("Error while withdrawing request");
        }
      })
      .catch((err) => {
        // console.log(err.response.data);
        toast.error("Error while withdrawing request");
      })
      .finally(() => {
        setRequestLoading(false);
      });
  };

  // Reject request api call
  const handleRejectRequest = async (e: any) => {
    e.preventDefault();
    setRequestLoading(true);
    await axios
      .post(`${domain}/api/reject-request`, {
        senderId: Number(selectedUser?.id),
        receiverId: Number(session?.user?.id),
      })
      .then((response) => {
        if (response?.data?.success === true) {
          // console.log(response.data);
          setFriendshipStatus("not_friends");
          toast.success("Request rejected successfully");
        } else {
          // console.log(response.data);
          toast.error("Error while rejecting request ");
        }
      })
      .catch((err) => {
        toast.error("Error while rejecting request");
      })
      .finally(() => {
        setRequestLoading(false);
      });
  };

  // send request api call

  const handleSendRequest = async (e: any) => {
    e.preventDefault();
    setRequestLoading(true);
    await axios
      .post(`${domain}/api/send-request`, {
        senderId: Number(session?.user?.id),
        receiverId: Number(selectedUser?.id),
      })
      .then((response) => {
        if (response?.data?.success === true) {
          // console.log(response.data);
          setFriendshipStatus("request_sent");
          toast.success("Request sent  successfully");
        } else {
          // console.log(response.data);
          toast.error("Error while sending request");
        }
      })
      .catch((err) => {
        // console.log(err.response.data);
        toast.error("Error while sending request");
      })
      .finally(() => {
        setRequestLoading(false);
      });
  };

  // Open chatarea

  const handleOpenChatArea = () => {
    const data = selectedUser;
    if (data) data.type = "friend";

    if (data) {
      // console.log("New user set properly ");
      // console.log(data);
      setSelectedUser({ ...selectedUser, type: "friend" });
    }
  };

  const renderActionButton = () => {
    switch (friendshipStatus) {
      case "not_friends":
        return (
          <Button
            className="bg-white text-black hover:bg-gray-200 rounded-full px-6 py-2 text-sm font-semibold transition-colors duration-200"
            onClick={handleSendRequest}
          >
            <UserPlus className="w-5 h-5 mr-2" />
            Send Request
          </Button>
        );
      case "request_sent":
        return (
          <Button
            className="bg-gray-600 text-white hover:bg-gray-700 rounded-full px-6 py-2 text-sm font-semibold transition-colors duration-200"
            onClick={handleWithdrawRequest}
          >
            <UserMinus className="w-5 h-5 mr-2" />
            Withdraw Request
          </Button>
        );
      case "request_received":
        return (
          <>
            <div className="flex space-x-4">
              <Button
                className="bg-green-500 text-white hover:bg-green-600 rounded-full px-6 py-2 text-sm font-semibold transition-colors duration-200"
                onClick={handleAcceptRequest}
              >
                <Check className="w-5 h-5 mr-2" />
                Accept Request
              </Button>
              <Button
                className="bg-red-500 text-white hover:bg-red-600 rounded-full px-6 py-2 text-sm font-semibold transition-colors duration-200"
                onClick={handleRejectRequest}
              >
                <X className="w-5 h-5 mr-2" />
                Reject Request
              </Button>
            </div>
          </>
        );
      case "friends":
        return (
          <Button
            //TODO: Open chatArea on click
            //
            onClick={handleOpenChatArea}
            className="bg-blue-500 text-white hover:bg-blue-600 rounded-full px-6 py-2 text-sm font-semibold transition-colors duration-200"
          >
            <MessageSquare className="w-5 h-5 mr-2" />
            Message
          </Button>
        );
      default:
        return null;
    }
  };

  const getInitials = (username: string) => {
    if (!username) return "";
    return username
      .split(" ")
      .map((name) => name[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center lg:justify-start p-4">
      <div className="flex-grow flex flex-col items-center justify-center space-y-6">
        <div className="relative w-32 h-32">
          {user.profilePic ? (
            <div className="relative w-full h-full rounded-full ring-2 ring-offset-2 dark:ring-offset-gray-900 ring-gray-200 dark:ring-gray-700">
              <Image
                src={user.profilePic}
                alt={user.username || ""}
                layout="fill"
                objectFit="cover"
                className="rounded-full"
              />
            </div>
          ) : (
            <div className="w-full h-full rounded-full flex items-center justify-center text-3xl font-semibold bg-gray-100 dark:bg-gray-800 ring-2 ring-offset-2 dark:ring-offset-gray-900 ring-gray-200 dark:ring-gray-700">
              {getInitials(user?.username)}
            </div>
          )}
          {/* <Image */}
          {/*   src={user.profilePic} */}
          {/*   alt={user.username || ""} */}
          {/*   layout="fill" */}
          {/*   objectFit="cover" */}
          {/*   className="rounded-full" */}
          {/* /> */}
        </div>
        <h2 className="text-3xl font-bold">{user.username}</h2>
        {loading ? (
          <Loader2 className="w-6 h-6 animate-spin" />
        ) : requestLoading ? (
          <Loader2 className="w-6 h-6 animate-spin" />
        ) : (
          renderActionButton()
        )}
      </div>

      <div className="p-4 flex justify-center">
        <Button
          variant="ghost"
          className="text-white hover:bg-[#282b30] rounded-full"
          onClick={() => {
            setSelectedUser(null);
          }}
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back
        </Button>
      </div>
    </div>
  );
}
