import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import bcrypt from "bcrypt";
import { responseType } from "@/types/responseType";
import prisma from "@/db/dbConnect";
import { v4 as uuid } from "uuid";
import { sendForgetPasswordEmail } from "@/resend/forgetPasswordEmail";

const userValidationType = z
  .object({
    email: z.string().email("Please enter a valid email address"),
  })
  .strict();

type userType = z.infer<typeof userValidationType>;

// Send Email
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

    const user = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!user) {
      const errResponse: responseType = {
        success: false,
        status: 400,
        message: "User not found",
      };
      return NextResponse.json(errResponse);
    }

    if (!user.isVerified) {
      const errResponse: responseType = {
        success: false,
        status: 400,
        message: "Account not verified",
      };
      return NextResponse.json(errResponse);
    }

    // const otp = await sha256(uuid());
    let otp = uuid() + uuid();

    const otpExpiryTime = generateOTPExpiryTime();

    //TODO: Send Email

    // update user reset password otp
    await prisma.user.update({
      where: {
        email: data.email,
      },
      data: {
        passwordResetOtp: otp,
        passwordResetOtpExpiry: otpExpiryTime,
      },
    });

    // send email

    await sendForgetPasswordEmail(user.username, user.email, otp);

    const successResponse: responseType = {
      success: true,
      status: 200,
      message: "OTP sent successfully",
      messages: [{ otp }],
    };
    return NextResponse.json(successResponse);
  } catch (err) {
    console.log("Error while sending forget-password email", err);
    console.log(err);
    const errResponse: responseType = {
      success: false,
      status: 500,
      message: "Internal server error",
    };
    return NextResponse.json(errResponse);
  }
}

// Update Password

const updatePasswordValidationType = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(32, "Password must be at most 32 characters long"),
  confirmPassword: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(32, "Password must be at most 32 characters long"),
  token: z.string().min(1, "Token is required"),
});

type updatePasswordType = z.infer<typeof updatePasswordValidationType>;
export async function PUT(req: NextRequest) {
  try {
    const data: updatePasswordType = await req.json();

    const zodResponse = updatePasswordValidationType.safeParse(data);
    if (!zodResponse.success) {
      const errResponse: responseType = {
        success: false,
        status: 400,
        message: fromZodError(zodResponse?.error).message,
      };
      return NextResponse.json(errResponse);
    }

    if (data.password !== data.confirmPassword) {
      const errResponse: responseType = {
        success: false,
        status: 400,
        message: "Password and confirm password does not match",
      };
      return NextResponse.json(errResponse);
    }

    const userFind = await prisma.user.findFirst({
      where: {
        passwordResetOtp: data.token,
      },
    });

    if (!userFind || !userFind.passwordResetOtpExpiry) {
      const errResponse: responseType = {
        success: false,
        status: 400,
        message: "Invalid Link",
      };
      return NextResponse.json(errResponse);
    }

    if (userFind.passwordResetOtpExpiry < new Date()) {
      const errResponse: responseType = {
        success: false,
        status: 400,
        message: "Link expired",
      };
      return NextResponse.json(errResponse);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    await prisma.user.update({
      where: {
        email: userFind.email,
      },
      data: {
        password: hashedPassword,
        passwordResetOtp: null,
        passwordResetOtpExpiry: null,
      },
    });

    const successResponse: responseType = {
      success: true,
      status: 200,
      message: "Password updated successfully",
    };
    return NextResponse.json(successResponse);
  } catch (err) {
    console.log("Error in update password  " + err);
    const errResponse: responseType = {
      success: false,
      status: 500,
      message: "Internal server error",
    };
    return NextResponse.json(errResponse);
  }
}

// Generate OTP Expiry Time

const generateOTPExpiryTime = () => {
  const currentTime = new Date();
  const expiryTime = new Date(currentTime.getTime() + 60 * 60 * 1000);
  return expiryTime;
};
