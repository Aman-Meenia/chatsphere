import prisma from "@/db/dbConnect";
import { responseType } from "@/types/responseType";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

const userValidationType = z.object({
  username: z.string().min(1, "Username is required"),
  otp: z.string(),
});
type userType = z.infer<typeof userValidationType>;

export async function POST(req: NextRequest) {
  try {
    const data: userType = await req.json();

    const zodResponse = userValidationType.safeParse(data);

    if (!zodResponse.success) {
      const errorResponse: responseType = {
        message: fromZodError(zodResponse?.error).message,
        success: false,
        status: 200,
      };
      return NextResponse.json(errorResponse);
    }

    const userFind = await prisma.user.findUnique({
      where: {
        username: data.username,
      },
    });

    if (!userFind) {
      const errResponse: responseType = {
        success: false,
        status: 400,
        message: "No user found with this username",
      };
      return NextResponse.json(errResponse);
    }

    if (userFind.isVerified) {
      const errResponse: responseType = {
        success: false,
        status: 400,
        message: "User already verified",
      };
      return NextResponse.json(errResponse);
    }

    if (userFind.otp !== data.otp) {
      const errResponse: responseType = {
        success: false,
        status: 400,
        message: "OTP is not valid",
      };
      return NextResponse.json(errResponse);
    }

    if (userFind.otpExpiry < new Date()) {
      const errResponse: responseType = {
        success: false,
        status: 400,
        message: "OTP is expired",
      };
      return NextResponse.json(errResponse);
    }

    const verifiedUser = await prisma.user.update({
      where: {
        username: data.username,
      },
      data: {
        isVerified: true,
      },
    });

    const successResponse: responseType = {
      success: true,
      status: 200,
      message: "User verified successfully",
    };
    return NextResponse.json(successResponse);
  } catch (err) {
    console.log("Error while verifying user: ", err);
    const errResponse: responseType = {
      success: false,
      status: 500,
      message: "Internal server error",
    };
    return NextResponse.json(errResponse);
  }
}
