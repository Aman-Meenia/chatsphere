import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { responseType } from "@/types/responseType";
import prisma from "@/db/dbConnect";
import { getToken } from "next-auth/jwt";

const dataTypeValidation = z.object({
  username: z.string().min(1, "Username is required"),
});
type dataType = z.infer<typeof dataTypeValidation>;
export async function POST(req: NextRequest) {
  try {
    //TODO: Get the current user id from token and exclude it

    const data: dataType = await req.json();

    const token = await getToken({ req, secret: process.env.NEXT_AUTH_SECRET });

    const zodResponse = dataTypeValidation.safeParse(data);

    if (!zodResponse.success) {
      const errResponse: responseType = {
        success: false,
        status: 400,
        message: "User name is required to search user",
      };
      return NextResponse.json(errResponse);
    }

    // if (!token?.id) {
    //   const errResponse: responseType = {
    //     success: false,
    //     status: 400,
    //     message: "Unauthorized user",
    //   };
    //   return NextResponse.json(errResponse);
    // }
    const userId = 1;
    const searchUsers = await prisma.user.findMany({
      where: {
        AND: [
          {
            username: {
              contains: data.username,
              mode: "insensitive",
            },
          },
          {
            NOT: {
              id: Number(123),
            },
          },
          {
            isVerified: true,
          },
        ],
      },
      select: {
        username: true,
        id: true,
      },
    });
    //
    // console.log("<______________ SEARCH USERS ___________________>");
    // console.log(searchUsers);
    const successResponse: responseType = {
      status: 200,
      success: true,
      message: "User with given name fetched successfully ",
      messages: [searchUsers],
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
