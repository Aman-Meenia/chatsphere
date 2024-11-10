import ChatArea from "@/components/chatArea/ChatArea";
import axios from "axios";
import HomePage from "@/components/home/HomePage";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]/authOptions";
import { loggedInUserType } from "@/store/ContextProvider";

const domain = process.env.NEXT_PUBLIC_DOMAIN;

type FriendsData = {
  success: boolean;
  messages: Array<{ friendsList: friendListType[] }>;
};

export type friendListType = {
  username: string;
  id: number | string;
  image?: string;
  isGroup?: boolean;
  lastMessage?: string;
  unseenMsgCount?: number;
  socketId: string;
};

async function fetchFriendsData(id: number): Promise<FriendsData> {
  try {
    const response = await axios.post(`${domain}/api/users`, { id });
    if (response?.data?.success === true) {
      return response.data;
    }
    return { success: false, messages: [] };
  } catch (err) {
    console.error("Error fetching friends data:", err);
    return { success: false, messages: [] };
  }
}

export default async function ChatApp() {
  const session = await getServerSession(authOptions);
  let username = session?.user?.username;
  if (!username) {
    username = "";
  }
  const loggedInUserData: loggedInUserType = {
    username: username,
    image: session?.user?.image,
    id: Number(session?.user?.id),
  };
  console.log(
    "<-----------------------------------------------User detail  ---------------------------------->",
  );
  console.log(loggedInUserData);

  if (!session || !session.user?.id) {
    return (
      <div className="flex h-screen bg-gray-900 text-white">
        <div className="w-full lg:w-80 border-r border-gray-700 flex flex-col"></div>
        <h1>User Not Authenticated</h1>
      </div>
    );
  }

  const friendsData = await fetchFriendsData(Number(session.user.id));
  console.log("<---------- Freinds Date ------------>");

  if (!friendsData.success || !friendsData.messages.length) {
    return (
      <div className="flex h-screen bg-gray-900 text-white">
        <div className="w-full lg:w-80 border-r border-gray-700 flex flex-col"></div>
        <h1>User Not Found</h1>
      </div>
    );
  }

  const friendsList = friendsData.messages[0]?.friendsList || [];

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <HomePage friendsList={friendsList} loggedInUserData={loggedInUserData} />
      <ChatArea />
    </div>
  );
}
