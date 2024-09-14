import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { responseType } from "@/types/responseType";
import prisma from "@/db/dbConnect";
import { getToken } from "next-auth/jwt";
import { group, profile } from "console";
import { Socket } from "dgram";

const userTypeValidation = z.object({
  id: z.number(),
});
type userType = z.infer<typeof userTypeValidation>;
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    // // console.log("<------------------- DATA IS ---------------------->");
    // // console.log("DATA " + data.id);
    // console.log(data.id);

    const zodResponse = userTypeValidation.safeParse(data);

    if (!zodResponse.success) {
      const errResponse: responseType = {
        success: false,
        status: 400,
        message: fromZodError(zodResponse?.error).message,
      };
      return NextResponse.json(errResponse);
    }

    // const token = await getToken({
    //   req,
    //   secret: process.env.NEXT_AUTH_SECRET,
    // });
    //
    // console.log(token);
    // if (!token) {
    //   const errResponse: responseType = {
    //     success: false,
    //     status: 400,
    //     message: "Unauthorized user",
    //   };
    //   return NextResponse.json(errResponse);
    // }

    const allfriendsList = await prisma.request.findMany({
      where: {
        AND: {
          OR: [
            {
              senderId: Number(data?.id),
            },
            {
              receiverId: Number(data?.id),
            },
          ],
          status: "ACCEPTED",
        },
      },
      include: {
        chat: {
          include: {
            lastmessages: true,
          },
          // select: {
          //   unseenMsgCount1: true,
          //   unseenMsgCount2: true,
          //   user1: true,
          //   user2: true,
          //             },
        },
        sender: {
          select: {
            username: true,
            id: true,
            profilePic: true,
          },
        },
        receiver: {
          select: {
            username: true,
            id: true,
            profilePic: true,
          },
        },
      },
    });
    console.log("<--------- FriendList ---------->");
    console.log(allfriendsList);

    // Fetch groups in which user is member

    const groups = await prisma.group.findMany({
      where: {
        members: {
          some: {
            id: Number(data.id),
          },
        },
      },
      select: {
        id: true,
        groupName: true,
        profilePic: true,
        socketId: true,
      },
    });
    // console.log("<------------Group List -------------->");
    // console.log(groups);

    type DetailType = {
      username: string;
      id: string;
      image: string | null;
      isGroup: boolean;
      lastMessage: string | null;
      unseenMsgCount: number;
      socketId: string;
    };

    const friendsList: DetailType[] = [];

    const friendList = allfriendsList.map((request) => {
      const friend =
        request.senderId === Number(data?.id)
          ? request.receiver
          : request.sender;
      console.log("id " + request?.chat?.user1 + "data.id " + data.id);

      return {
        username: friend.username,
        id: String(friend.id),
        image: friend.profilePic,
        isGroup: false,
        socketId: request?.socketId,
        lastMessage: request.chat?.lastmessages
          ? request?.chat?.lastmessages?.content
          : "",
        unseenMsgCount: request?.chat?.user1
          ? Number(request?.chat?.user1) === Number(data.id)
            ? request?.chat?.unseenMsgCount1
            : request?.chat?.unseenMsgCount2
          : 0,
      };
    });

    const groupList = groups.map((group) => {
      return {
        username: group.groupName,
        id: group.id,
        image: group.profilePic,
        isGroup: true,
        socketId: group.socketId,
        lastMessage: "",
        unseenMsgCount: 0,
      };
    });

    friendsList.push(...friendList, ...groupList);

    // console.log("<------ FRIEND LIST -------->");
    // console.log(friendsList);

    const successResponse: responseType = {
      success: true,
      status: 200,
      message: "Users fetched successfully",
      messages: [{ friendsList }],
    };

    return NextResponse.json(successResponse);
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
