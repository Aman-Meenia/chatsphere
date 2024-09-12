import VerificationEmail from "@/emails/verificationEmail";
import { resend } from "./resend";

export async function sendVerificationEmail(
  username: string,
  email: string,
  otp: string,
) {
  try {
    const Response = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Logic Lab | Verification Code",
      react: VerificationEmail({ username, otp }),
    });
    console.log(Response, "resend email response");

    return true;
  } catch (emailError) {
    console.error("Error sending verification email:", emailError);
    return false;
  }
}
