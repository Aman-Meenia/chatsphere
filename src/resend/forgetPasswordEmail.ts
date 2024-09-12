import ForgetPasswordEmail from "@/emails/forgetPasswordEmail";
import { resend } from "./resend";

export async function sendForgetPasswordEmail(
  username: string,
  email: string,
  token: string,
) {
  try {
    const Response = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "ChatSphere | Forget Password",
      react: ForgetPasswordEmail({ username, token }),
    });
    console.log(Response, "resend email response");

    return true;
  } catch (emailError) {
    console.error("Error sending forget password email:", emailError);
    return false;
  }
}
