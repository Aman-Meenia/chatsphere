import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { responseType } from "@/types/responseType";
import prisma from "@/db/dbConnect";
const requestTypeValidation = z
  .object({
    userId: z.number().positive(),
    groupId: z.string().min(1, "Group Id is required"),
  })
  .strict();
type requestType = z.infer<typeof requestTypeValidation>;
export async function POST(req: NextRequest) {
  try {
    const data: requestType = await req.json();

    const zodResponse = requestTypeValidation.safeParse(data);

    if (!zodResponse.success) {
      const errResponse: responseType = {
        success: false,
        status: 400,
        message: fromZodError(zodResponse.error).message,
      };
      return NextResponse.json(errResponse);
    }

    //TODO: Check Token to validate if user is authenticated or not

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
        success: false,
        status: 400,
        message: "No group find",
      };
      return NextResponse.json(errResponse);
    }

    if (!groupFind.chat_id) {
      const errResponse: responseType = {
        success: true,
        status: 200,
        message: "Message fetched successfully, No Messages",
        messages: [],
      };

      return NextResponse.json(errResponse);
    }
    const allChats = await prisma.chat.findFirst({
      where: {
        id: groupFind.chat_id,
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
    const reshapedMessages = allChats?.messages.map((message) => ({
      id: message.id,
      senderId: message.senderId,
      content: message.content,
      createdAt: message.createdAt,
      status: message.status,
      senderUsername: message.sender.username,
      senderProfilePic: message.sender.profilePic,
    }));
    const successResponse: responseType = {
      success: true,
      status: 200,
      message: "Message fetched successfully",
      messages: [{ allChats: reshapedMessages }],
    };
    console.log("<--------------------All Chats ------------------>");
    console.log(allChats);
    return NextResponse.json(successResponse);
  } catch (err) {
    console.log("Error while fetching gorup messages ");
    console.log(err);
    const errResponse: responseType = {
      status: 500,
      success: false,
      message: "Internal server error",
    };
    return NextResponse.json(errResponse);
  }
}
