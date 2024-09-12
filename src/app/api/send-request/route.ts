import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import dbConnect from "@/db/dbConnect";
import { responseType } from "@/types/responseType";
import prisma from "@/db/dbConnect";

const requestValidationType = z.object({
  senderId: z.number(),
  receiverId: z.number(),
});
type requestType = z.infer<typeof requestValidationType>;

export async function POST(req: NextRequest) {
  try {
    const data: requestType = await req.json();

    const zodResponse = requestValidationType.safeParse(data);

    if (!zodResponse.success) {
      const errorResponse: responseType = {
        message: fromZodError(zodResponse?.error).message,
        success: false,
        status: 400,
      };
      return NextResponse.json(errorResponse);
    }

    const sender = await dbConnect.user.findUnique({
      where: {
        id: Number(data.senderId),
      },
    });

    const receiver = await dbConnect.user.findUnique({
      where: {
        id: Number(data.receiverId),
      },
    });

    if (!sender && !receiver) {
      const errResponse: responseType = {
        success: false,
        status: 400,
        message: "Invalid sender and receiver Id ",
      };
      return NextResponse.json(errResponse);
    }

    if (!sender) {
      const errResponse: responseType = {
        success: false,
        status: 400,
        message: "Invalid sender Id",
      };
      return NextResponse.json(errResponse);
    }

    if (!receiver) {
      const errResponse: responseType = {
        success: false,
        status: 400,
        message: "Invalid receiver Id",
      };
      return NextResponse.json(errResponse);
    }

    if (sender.id === receiver.id) {
      const errResponse: responseType = {
        success: false,
        status: 400,
        message: "Cannot send request to yourself",
      };
      return NextResponse.json(errResponse);
    }

    // check if already friend or send request

    const checkFriend = await prisma.request.findFirst({
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

    if (checkFriend?.status === "ACCEPTED") {
      const errResponse: responseType = {
        success: false,
        status: 400,
        message: "Already friends",
      };
      return NextResponse.json(errResponse);
    }

    if (
      checkFriend?.status === "PENDING" &&
      checkFriend.senderId === Number(data.senderId)
    ) {
      const errResponse: responseType = {
        success: false,
        status: 400,
        message: "Friend request already sent",
      };
      return NextResponse.json(errResponse);
    }

    if (
      checkFriend?.status === "PENDING" &&
      checkFriend.senderId === Number(data.receiverId)
    ) {
      const errResponse: responseType = {
        success: false,
        status: 400,
        message: "Already received friend request",
      };
      return NextResponse.json(errResponse);
    }

    const newReq = await prisma.request.create({
      data: {
        senderId: Number(data.senderId),
        receiverId: Number(data.receiverId),
        status: "PENDING",
      },
    });

    const successResponse: responseType = {
      success: true,
      status: 200,
      message: "Request sent successfully",
      messages: [newReq],
    };
    return NextResponse.json(successResponse);
  } catch (err) {
    console.log("Error in requset sent api", err);
    console.log(err);
    const errResponse: responseType = {
      success: false,
      status: 500,
      message: "Internal server error",
    };
    return NextResponse.json(errResponse);
  }
}
