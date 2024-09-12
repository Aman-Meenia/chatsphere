import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import prisma from "@/db/dbConnect";
import { responseType } from "@/types/responseType";

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

    // check if the request received

    const requestReceived = await prisma.request.findFirst({
      where: {
        senderId: Number(data.senderId),
        receiverId: Number(data.receiverId),
      },
    });

    if (!requestReceived) {
      const errResponse: responseType = {
        success: false,
        status: 400,
        message: "Request not found",
      };
      return NextResponse.json(errResponse);
    }

    // Check if already friend

    if (requestReceived.status === "ACCEPTED") {
      const errResponse: responseType = {
        success: false,
        status: 400,
        message: "Already friends",
      };
      return NextResponse.json(errResponse);
    }

    // Now accept request

    const acceptRequest = await prisma.request.update({
      where: {
        id: requestReceived.id,
      },
      data: {
        status: "ACCEPTED",
      },
    });

    const successResponse: responseType = {
      success: true,
      status: 200,
      message: "Request accepted successfully",
      messages: [acceptRequest],
    };
    return NextResponse.json(successResponse);
  } catch (err) {
    console.log("Error while accepting request", err);
    const errResponse: responseType = {
      success: false,
      status: 500,
      message: "Internal server error",
    };
    return NextResponse.json(errResponse);
  }
}
