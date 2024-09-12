import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { responseType } from "@/types/responseType";
import prisma from "@/db/dbConnect";
import { group } from "console";

const requestValidationType = z
  .object({
    groupName: z
      .string()
      .min(1, "Group name is required")
      .max(50, "Group name is maximum only of 50 characters"),
    adminId: z.number().positive(),
    userIds: z
      .array(z.number().nonnegative())
      .min(2, "Minimum 2 users required to create group")
      .max(10, "Maximum number of users in group can be upto 10"),
  })
  .strict();

type requestType = z.infer<typeof requestValidationType>;

export async function POST(req: NextRequest) {
  try {
    const data: requestType = await req.json();

    const zodResponse = requestValidationType.safeParse(data);

    if (!zodResponse.success) {
      const errResponse: responseType = {
        status: 400,
        success: false,
        message: fromZodError(zodResponse.error).message,
      };
      return NextResponse.json(errResponse);
    }

    // check if the adminId is a valid Id

    const findAdmin = await prisma.user.findFirst({
      where: {
        id: Number(data.adminId),
      },
    });

    //TODO: Istead of checking adminId we can also check from token
    if (!findAdmin) {
      const errResponse: responseType = {
        status: 400,
        success: false,
        message: "Admin is unauthorized",
      };
      return NextResponse.json(errResponse);
    }

    for (const userId of data.userIds) {
      const findUser = await prisma.user.findFirst({
        where: {
          id: Number(userId),
        },
      });

      if (!findUser) {
        const errResponse: responseType = {
          status: 400,
          success: false,
          message: "Selected users are not valid",
        };
        return NextResponse.json(errResponse);
      }
    }

    data.userIds.push(data.adminId);
    // create group
    // data.userIds
    const newGroup = await prisma.group.create({
      data: {
        admin_id: Number(data.adminId),
        groupName: data.groupName,
        members: {
          connect: data.userIds.map((userId: number) => ({ id: userId })),
        },
      },
      include: {
        members: true,
        groupAdmin: true,
      },
    });
    console.log(newGroup);
    console.log(data);
    const successResponse: responseType = {
      success: true,
      status: 200,
      message: "Group Created Successfuly",
    };
    return NextResponse.json(successResponse);
  } catch (err) {
    console.log("Error in create group api ");
    console.log(err);
    const errResponse: responseType = {
      success: false,
      status: 500,
      message: "Internal server error",
    };
    return NextResponse.json(errResponse);
  }
}
