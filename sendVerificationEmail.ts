import { ApiRepsonse } from "@/types/ApiResponse";
import { resend } from "./resend";
import VerificationEmail from "./emails/verificationEmail";
import nodemailer from "nodemailer";

interface verificationEmailProps {
  email: string;
  username: string;
  verifyCode: string;
}

export const sendVerificationEmail = async ({
  email,
  username,
  verifyCode,
}: verificationEmailProps) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      service: "Gmail",
      port: 587,
      secure: false, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: process.env.NEXT_PUBLIC_USER,
        pass: process.env.NEXT_PUBLIC_PASS,
      },
    })

    
    const info = await transporter.sendMail({
        from: 'bansalcb2021@gmail.com',
        to: email,
        subject:"Email Verification",
        html:VerificationEmail({username,otp:verifyCode})
    })

    if(info?.messageId){
      return { success: true, message: 'Verification email sent successfully.' };
    }else{
      return { success: true, message: `Error in sending email to ${email}.` };
    }
  } catch (err: any) {
    console.error("Something went wrong!", err);
    return { success: false, message: "Something went wrong!" };
  }
};
