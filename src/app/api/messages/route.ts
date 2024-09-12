import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { responseType } from "@/types/responseType";
import prisma from "@/db/dbConnect";
import { Content } from "next/font/google";
import { profile } from "console";
const requestValidationType = z
  .object({
    senderId: z.number().nonnegative(),
    receiverId: z.number().nonnegative(),
  })
  .strict();

type requestType = z.infer<typeof requestValidationType>;
export async function POST(req: NextRequest) {
  try {
    const data: requestType = await req.json();
    // // console.log("----------------------DATA IS------------------------- ");
    // console.log(data);

    const zodResponse = requestValidationType.safeParse(data);

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
    // Get chats of users where the senderId = data.senderId and receiverId = data.receiverId

    const allChats = await prisma.chat.findFirst({
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
      include: {
        lastmessages: true,
        messages: {
          orderBy: {
            createdAt: "asc",
          },
          include: {
            sender: {
              select: {
                username: true,
                profilePic: true,
              },
            },
            receiver: {
              select: {
                username: true,
                profilePic: true,
              },
            },
          },
        },
      },
    });
    // Reshape the messages

    if (allChats) {
      if (allChats.user1 == Number(data.senderId)) {
        await prisma.chat.update({
          where: {
            id: allChats.id,
          },
          data: {
            unseenMsgCount1: 0,
          },
        });
      } else {
        await prisma.chat.update({
          where: {
            id: allChats.id,
          },
          data: {
            unseenMsgCount2: 0,
          },
        });
      }
    }

    const reshapedMessages = allChats?.messages.map((message) => ({
      id: message.id,
      senderId: message.senderId,
      content: message.content,
      createdAt: message.createdAt,
      status: message.status,
      senderUsername: message.sender.username,
      senderProfilePic: message.sender.profilePic,
    }));

    // console.log(chatFind);
    const sucessResponse: responseType = {
      success: true,
      status: 200,
      message: "Chats fetched successfully",
      messages: [{ allChats: reshapedMessages }],
    };
    return NextResponse.json(sucessResponse);
  } catch (err) {
    console.log(err);
    const errResponse: responseType = {
      success: false,
      status: 500,
      message: "Internal server error",
    };
    return NextResponse.json(errResponse);
  }
}
