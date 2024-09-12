import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { responseType } from "@/types/responseType";
import prisma from "@/db/dbConnect";

const messageValidationType = z
  .object({
    senderId: z.number().nonnegative(),
    receiverId: z.number().nonnegative(),
    message: z.string().min(1, "You can't send an empty message").max(1000),
  })
  .strict();
type messageType = z.infer<typeof messageValidationType>;
export async function POST(req: NextRequest) {
  try {
    const data: messageType = await req.json();

    const zodResponse = messageValidationType.safeParse(data);
    console.log("Response is ----------------->");
    console.log(data);

    if (!zodResponse.success) {
      const errorResponse: responseType = {
        message: fromZodError(zodResponse?.error).message,
        success: false,
        status: 200,
      };
      return NextResponse.json(errorResponse);
    }

    //TODO: get sender id from token to check if user is logged in or not

    // validate sender id

    const userFind = await prisma.user.findUnique({
      where: {
        id: data.receiverId,
      },
    });

    if (!userFind) {
      const errorResponse: responseType = {
        message: "User not found",
        success: false,
        status: 400,
      };
      return NextResponse.json(errorResponse);
    }

    // check if they are friends;

    const friendCheck = await prisma.request.findFirst({
      where: {
        OR: [
          {
            senderId: Number(data.senderId),
            receiverId: Number(data.receiverId),
          },
          {
            senderId: Number(data.receiverId),
            receiverId: Number(data.senderId),
          },
        ],
      },
    });

    if (!friendCheck) {
      const errorResponse: responseType = {
        message: "You can only send messages to you friends",
        success: false,
        status: 400,
      };
      return NextResponse.json(errorResponse);
    }

    // create message

    const message = await prisma.message.create({
      data: {
        senderId: Number(data.senderId),
        receiverId: Number(data.receiverId),
        content: data.message,
        status: "SENT",
      },

      include: {
        sender: true,
        receiver: true,
      },
    });

    // check if already chat exists

    const findChat = await prisma.chat.findFirst({
      where: {
        OR: [
          {
            user1: Number(data.senderId),
            user2: Number(data.receiverId),
          },
          {
            user1: Number(data.receiverId),
            user2: Number(data.senderId),
          },
        ],
      },
    });

    if (!findChat) {
      // create new chat

      const newChat = await prisma.chat.create({
        data: {
          user1: Number(data.senderId),
          user2: Number(data.receiverId),
          lastMessage: message.id,
          unseenMsgCount2: 1,
          messages: {
            connect: {
              id: message.id,
            },
          },
        },
        include: {
          messages: true,
        },
      });

      // If we create new chat also make the update in request model to get the lastMessage , unseenMsgCount

      const request = await prisma.request.findFirst({
        where: {
          OR: [
            {
              senderId: Number(data.senderId),
              receiverId: Number(data.receiverId),
            },
            {
              senderId: Number(data.receiverId),
              receiverId: Number(data.senderId),
            },
          ],
        },
      });

      const requestUpdate = await prisma.request.update({
        where: {
          id: request?.id,
        },
        data: {
          chatId: {
            set: newChat.id,
          },
        },

        include: {
          chat: true,
        },
      });
    } else {
      if (findChat.user1 === data.senderId) {
        const chat = await prisma.chat.update({
          where: {
            id: findChat.id,
          },
          data: {
            lastMessage: message.id,
            unseenMsgCount1: 0,
            unseenMsgCount2: {
              increment: 1,
            },
            messages: {
              connect: {
                id: message.id,
              },
            },
          },
          include: {
            messages: true,
          },
        });
        console.log(chat);
      } else {
        const chat = await prisma.chat.update({
          where: {
            id: findChat.id,
          },
          data: {
            lastMessage: message.id,
            unseenMsgCount1: {
              increment: 1,
            },
            unseenMsgCount2: 0,
            messages: {
              connect: {
                id: message.id,
              },
            },
          },
          include: {
            messages: true,
          },
        });
        console.log(chat);
      }
    }
    console.log(message);
    const messageResponse = {
      id: message.id,
      senderId: message.senderId,
      receiverId: message.receiverId,
      content: message.content,
      createdAt: message.createdAt,
      status: message.status,
      senderUsername: message?.sender?.username,
      senderProfilePic: message?.sender?.profilePic,
    };
    const successResponse: responseType = {
      success: true,
      status: 200,
      message: "Message sent successfully",
      messages: [messageResponse],
    };
    console.log(
      "<------------------------Success----------------------------->",
    );
    console.log(successResponse);
    return NextResponse.json(successResponse);
  } catch (err) {
    console.log("Error while sending message");
    console.log(err);

    const errResponse: responseType = {
      success: false,
      status: 500,
      message: "Internal server error",
    };
    return NextResponse.json(errResponse);
  }
}
