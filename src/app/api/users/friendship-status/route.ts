import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import prisma from "@/db/dbConnect";
import { responseType } from "@/types/responseType";
import { getToken } from "next-auth/jwt";

const userValidationType = z.object({
  id: z.number(),
});

type userType = z.infer<typeof userValidationType>;

export async function POST(req: NextRequest) {
  try {
    const data: userType = await req.json();

    const zodResponse = userValidationType.safeParse(data);

    if (!zodResponse.success) {
      const errorResponse: responseType = {
        success: false,
        status: 400,
        message: fromZodError(zodResponse?.error).message,
      };
      return NextResponse.json(errorResponse);
    }
    const token = await getToken({ req, secret: process.env.NEXT_AUTH_SECRET });
    //
    if (!token) {
      const errResponse: responseType = {
        success: false,
        status: 400,
        message: "Unauthorized user",
      };
      return NextResponse.json(errResponse);
    }
    // console.log("<---------------TOKEN ------------->");
    // console.log(token);
    // console.log(data);

    const findFriend = await prisma.request.findFirst({
      where: {
        OR: [
          {
            senderId: Number(data?.id),
            receiverId: Number(token?.id),
          },
          {
            senderId: Number(token?.id),
            receiverId: Number(data?.id),
          },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        receiver: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });

    console.log("TOken id", token?.id);
    const friendshipStatus =
      findFriend?.senderId === Number(token?.id)
        ? "request_sent"
        : "request_received";

    console.log("Friendship status", friendshipStatus);

    let actualStatus;

    if (findFriend?.status === "ACCEPTED") {
      actualStatus = "friends";
    } else if (
      findFriend?.status === "PENDING" &&
      friendshipStatus === "request_sent"
    ) {
      actualStatus = "request_sent";
    } else if (
      findFriend?.status === "PENDING" &&
      friendshipStatus === "request_received"
    ) {
      actualStatus = "request_received";
    } else {
      actualStatus = "not_friends";
    }

    console.log(
      "<_________________________FRIENDSHIP STATUA __________________________->",
    );
    console.log("Actual status", actualStatus);
    console.log(findFriend);

    const successResponse: responseType = {
      success: true,
      status: 200,
      message: "Friendship status fetched successfully",
      messages: [
        {
          friendshipStatus: actualStatus,
        },
      ],
    };
    return NextResponse.json(successResponse);
  } catch (err) {
    console.log("Error in friendship status route", err);
    console.log(err);
    const errResponse: responseType = {
      success: false,
      status: 500,
      message: "Internal server error",
    };
    return NextResponse.json(errResponse);
  }
}
