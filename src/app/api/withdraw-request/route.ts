import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
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
        success: false,
        status: 400,
        message: fromZodError(zodResponse?.error).message,
      };
      return NextResponse.json(errorResponse);
    }

    if (data.senderId === data.receiverId) {
      const errResponse: responseType = {
        success: false,
        status: 400,
        message: "Sender and receiver can not be same",
      };
      return NextResponse.json(errResponse);
    }

    const sender = await prisma.user.findUnique({
      where: {
        id: Number(data.senderId),
      },
    });

    const receiver = await prisma.user.findUnique({
      where: {
        id: Number(data.receiverId),
      },
    });

    if (!sender && !receiver) {
      const errResponse: responseType = {
        success: false,
        status: 400,
        message: "Invalid sender and receiver id",
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

    // if request sent withdraw

    const friendRequest = await prisma.request.findFirst({
      where: {
        senderId: Number(data.senderId),
        receiverId: Number(data.receiverId),
      },
    });

    if (!friendRequest) {
      const errResponse: responseType = {
        success: false,
        status: 400,
        message: "No request found",
      };
      return NextResponse.json(errResponse);
    }

    if (friendRequest.status === "ACCEPTED") {
      const errResponse: responseType = {
        success: false,
        status: 400,
        message: "Request already accepted",
      };
      return NextResponse.json(errResponse);
    }

    const withdrawRequest = await prisma.request.delete({
      where: {
        id: friendRequest.id,
      },
    });

    const successResponse: responseType = {
      success: true,
      status: 200,
      message: "Request withdrawn successfully",
      messages: [withdrawRequest],
    };
    return NextResponse.json(successResponse);
  } catch (err) {
    console.log("Error in withdraw request", err);

    const errorResponse: responseType = {
      success: false,
      status: 500,
      message: "Internal Server Error",
    };
    return NextResponse.json(errorResponse);
  }
}
