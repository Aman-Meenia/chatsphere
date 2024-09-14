import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import prisma from "@/db/dbConnect";
import { responseType } from "@/types/responseType";
import { group } from "console";
import { pusherServer } from "@/pusher/pusher";

const requestTypeValidation = z
  .object({
    userId: z.number().positive(),
    groupId: z.string().min(1, "Group id is rquired"),
    message: z
      .string()
      .min(1, "You can't send an empty message")
      .max(1000, "Message can't exceed 1000 characters"),
  })
  .strict();
type requestType = z.infer<typeof requestTypeValidation>;
export async function POST(req: NextRequest) {
  try {
    const data: requestType = await req.json();

    const zodResponse = requestTypeValidation.safeParse(data);

    if (!zodResponse.success) {
      const errResponse: responseType = {
        status: 400,
        success: false,
        message: fromZodError(zodResponse.error).message,
      };
      return NextResponse.json(errResponse);
    }

    //TODO: Validate the user is login or not by checking token

    const userFind = await prisma.user.findUnique({
      where: {
        id: Number(data.userId),
      },
    });

    if (!userFind) {
      const errResponse: responseType = {
        status: 400,
        success: false,
        message: "User is unauthorized",
      };
      return NextResponse.json(errResponse);
    }

    // Check if group exist
    const groupFind = await prisma.group.findFirst({
      where: {
        id: data.groupId,
        members: {
          some: {
            id: Number(data.userId),
          },
        },
      },
    });

    if (!groupFind) {
      const errResponse: responseType = {
        status: 400,
        success: false,
        message: "Group not found",
      };
      return NextResponse.json(errResponse);
    }
    const message = await prisma.message.create({
      data: {
        content: data.message,
        senderId: Number(data.userId),
        groupId: data.groupId,
        status: "SENT",
      },
      include: {
        sender: true,
      },
    });
    // check if chat exists or not
    if (!groupFind.chat_id) {
      const newChat = await prisma.chat.create({
        data: {
          isGroupChat: true,
          lastMessage: message.id,
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

      // update chat_id in the group

      const updateChatId = await prisma.group.update({
        where: {
          id: data.groupId,
        },
        data: {
          chat_id: newChat.id,
        },
      });
      const messageResponse = {
        id: message.id,
        senderId: message.senderId,
        content: message.content,
        createdAt: message.createdAt,
        status: message.status,
        senderUsername: message?.sender?.username,
        senderProfilePic: message?.sender?.profilePic,
      };

      // send sokcet message
      const socketId = groupFind.socketId;
      pusherServer.trigger(socketId, "incoming-message", messageResponse);

      const successResponse: responseType = {
        status: 200,
        success: true,
        message: "Message sent successfully",
        messages: [messageResponse],
      };
      return NextResponse.json(successResponse);
    }
    // update chat by adding new message

    const updateChat = await prisma.chat.update({
      where: {
        id: groupFind.chat_id,
      },
      data: {
        lastMessage: message.id,
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
    const messageResponse = {
      id: message.id,
      senderId: message.senderId,
      content: message.content,
      createdAt: message.createdAt,
      status: message.status,
      senderUsername: message?.sender?.username,
      senderProfilePic: message?.sender?.profilePic,
    };
    // send sokcet message
    const socketId = groupFind.socketId;
    pusherServer.trigger(socketId, "incoming-message", messageResponse);
    const successResponse: responseType = {
      status: 200,
      success: true,
      message: "Message sent successfully",
      messages: [messageResponse],
    };
    return NextResponse.json(successResponse);
  } catch (err) {
    console.log("Error in group-message route ");
    console.log(err);
    const errResponse: responseType = {
      success: false,
      status: 500,
      message: "Internal server error",
    };
    return NextResponse.json(errResponse);
  }
}
