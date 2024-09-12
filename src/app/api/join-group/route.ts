import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import prisma from "@/db/dbConnect";
import { responseType } from "@/types/responseType";

const requestValidationType = z.object({
  groupId: z.string().min(1, "Group Id is required"),
  userId: z.number().positive(),
});

type requestType = z.infer<typeof requestValidationType>;

export async function POST(req: NextRequest) {
  try {
    const data: requestType = await req.json();

    const zodResponse = requestValidationType.safeParse(data);

    console.log("Data is");
    console.log(data);
    if (!zodResponse.success) {
      const errResponse: responseType = {
        status: 400,
        success: false,
        message: fromZodError(zodResponse.error).message,
      };
      return NextResponse.json(errResponse);
    }

    //TODO: Check a user is authorized or not by checking token

    const userFind = await prisma.user.findUnique({
      where: {
        id: data.userId,
      },
    });

    if (!userFind) {
      const errResponse: responseType = {
        success: false,
        status: 400,
        message: "User is not authorized",
      };
      return NextResponse.json(errResponse);
    }

    // check if group this exists or not

    const groupFind = await prisma.group.findUnique({
      where: {
        id: data.groupId,
      },
    });

    if (!groupFind) {
      const errResponse: responseType = {
        success: false,
        status: 400,
        message: "Invalid Group Id!!!",
      };

      return NextResponse.json(errResponse);
    }

    // check if the user already in group

    const group = await prisma.group.findUnique({
      where: { id: data.groupId },
      include: {
        members: {
          select: {
            id: true,
          },
        },
      },
    });

    const isUserAlreadyMember = group?.members.some(
      (member) => member.id === Number(data.userId),
    );
    if (isUserAlreadyMember) {
      const errResponse: responseType = {
        success: false,
        status: 400,
        message: "you are already in group",
      };
      return NextResponse.json(errResponse);
    }

    const updatedGroup = await prisma.group.update({
      where: {
        id: data.groupId,
      },
      data: {
        members: {
          connect: { id: data.userId },
        },
      },
    });
    console.log(updatedGroup);

    const successResponse: responseType = {
      status: 200,
      success: true,
      message: "Group Joined Successfully",
    };
    return NextResponse.json(successResponse);
  } catch (err) {
    console.log("Error in join-group api");
    console.log(err);
    const errResponse: responseType = {
      status: 500,
      success: false,
      message: "Internal server error",
    };

    return NextResponse.json(errResponse);
  }
}
