import axios from "axios";
import React from "react";
import Messages from "./Messages";

type getMessagesDataType = {
  senderId: number;
  receiverId: number;
};

type responseType = {
  success: boolean;
  status: number;
  message: string;
  messages: object[];
};

const domain = process.env.NEXT_PUBLIC_DOMAIN;
const getMessages = async ({
  data,
}: {
  data: getMessagesDataType;
}): Promise<responseType> => {
  const res = await axios
    .post(`${domain}/api/messages`, {
      senderId: Number(data.senderId),
      receiverId: Number(data.receiverId),
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response.data;
    });

  return res;
};

const FetchMessages = async () => {
  const res = await getMessages({ data: { senderId: 1, receiverId: 1 } });

  console.log(res);

  if (res.success === false) {
    //TODO: handle when we get error while fetching messages
  } else {
    return <Messages />;
  }
};

export default FetchMessages;
