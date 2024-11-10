import prisma from "@/db/dbConnect";
import { responseType } from "@/types/responseType";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import bcrypt from "bcrypt";
import { sendVerificationEmail } from "@/resend/verificationEmail";

const userValidationType = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters long")
      .regex(
        /^[a-z0-9@]+$/,
        "Username must only contain lowercase letters, numbers, and @",
      ),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(32, "Password must be at most 32 characters long"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long"),
  })
  .strict();

type userType = z.infer<typeof userValidationType>;
export async function POST(req: NextRequest) {
  try {
    const data: userType = await req.json();
    console.log(data);

    const zodResponse = userValidationType.safeParse(data);

    if (!zodResponse.success) {
      const errorResponse: responseType = {
        message: fromZodError(zodResponse?.error).message,
        success: false,
        status: 200,
      };
      return NextResponse.json(errorResponse);
    }

    if (data.password !== data.confirmPassword) {
      const errResponse: responseType = {
        success: false,
        status: 400,
        message: "Password and confirm password does not match",
      };
      return NextResponse.json(errResponse);
    }

    // check if username verified or code not expiry username alrady in use

    const userFind = await prisma.user.findUnique({
      where: {
        username: data.username,
      },
    });

    if (
      (userFind && userFind.isVerified) ||
      (userFind && userFind.otpExpiry > new Date())
    ) {
      const errResponse: responseType = {
        success: false,
        status: 400,
        message: "Username already exists",
      };
      return NextResponse.json(errResponse);
    }

    // if code expiry we can use that name

    if (userFind) {
      await prisma.user.delete({
        where: {
          username: data.username,
        },
      });
    }
    // check if the user with same eamil already exists

    const emailFind = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (emailFind && emailFind.isVerified) {
      const errResponse: responseType = {
        success: false,
        status: 400,
        message: "Account with this email already exists",
      };
      return NextResponse.json(errResponse);
    }

    if (emailFind && emailFind.otpExpiry > new Date()) {
      const errResponse: responseType = {
        success: false,
        status: 400,
        message:
          "Account with this email already registered , please verify your account",
      };
      return NextResponse.json(errResponse);
    }

    // if email is registered with another username and code is expiry delete that user and create new user

    if (emailFind) {
      await prisma.user.delete({
        where: {
          email: data.email,
        },
      });
    }

    // create user
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const otp = generateOTP();
    const otpExpiry = generateOTPExpiryTime();
    const user = await prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        password: hashedPassword,
        otp: otp,
        otpExpiry: otpExpiry,
      },
    });

    // send otp to email
    console.log("OTP is " + otp);
    await sendVerificationEmail(data.username, data.email, otp);
    const successResponse: responseType = {
      message: "User created successfully",
      success: true,
      status: 200,
      messages: [{ user }],
    };
    return NextResponse.json(successResponse);
  } catch (err) {
    console.log("Error in signup route ");
    console.log(err);
    const errResponse: responseType = {
      message: "Internal server error",
      success: false,
      status: 500,
    };
    return NextResponse.json(errResponse);
  }
}

// Generate OTP Function

const generateOTP = () => {
  const digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
};

// Generate OTP Expiry Time

const generateOTPExpiryTime = () => {
  const currentTime = new Date();
  const expiryTime = new Date(currentTime.getTime() + 60 * 60 * 1000);
  return expiryTime;
};
