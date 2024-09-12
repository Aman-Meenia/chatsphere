import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import prisma from "@/db/dbConnect";
import { responseType } from "@/types/responseType";

const requestValidationType = z.object({
  groupId: z.string().min(1, "Group Id is required"),
});

type requestType = z.infer<typeof requestValidationType>;
export async function POST(req: NextRequest) {
  try {
    const data: requestType = await req.json();

    console.log(data);
    const zodResponse = requestValidationType.safeParse(data);

    if (!zodResponse.success) {
      const errResponse: responseType = {
        success: false,
        status: 400,
        message: fromZodError(zodResponse.error).message,
      };
      return NextResponse.json(errResponse);
    }

    const groupUser = await prisma.group.findUnique({
      where: {
        id: data.groupId,
      },
      include: {
        groupAdmin: {
          select: {
            id: true,
            username: true,
            profilePic: true,
          },
        },
        members: {
          select: {
            id: true,
            username: true,
            profilePic: true,
          },
        },
      },
    });

    if (!groupUser) {
      const errResponse: responseType = {
        success: false,
        status: 400,
        message: "Invalid group Id",
      };
      return NextResponse.json(errResponse);
    }

    const successResponse: responseType = {
      success: true,
      status: 200,
      message: "Group Detail fetched successfully",
      messages: [{ groupUser }],
    };
    return NextResponse.json(successResponse);
  } catch (err) {
    console.log("Error while fethinc detail of the group " + err);
    const errResponse: responseType = {
      success: false,
      status: 500,
      message: "Internal server error",
    };
    return NextResponse.json(errResponse);
  }
}
