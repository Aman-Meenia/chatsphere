import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db/dbConnect";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { responseType } from "@/types/responseType";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.json();

    return NextResponse.json({ message: "Profile updated successfully" });
  } catch (err) {
    console.log("Error while updating profile");
    console.log("Error: ", err);
    const errResponse: responseType = {
      status: 500,
      success: false,
      message: "Internal server error",
    };
    return NextResponse.json(errResponse);
  }
}
