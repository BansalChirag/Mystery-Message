import { ApiRepsonse } from "@/types/ApiResponse";
import resetPasswordEmail from "./emails/resetPasswordEmail";
import bcrypt from "bcryptjs";
import User from "./models";
import nodemailer from "nodemailer";
import ReactDOMServer from "react-dom/server";

interface resetPasswordEmailProps {
  email: string;
  userId: string;
}

export const sendResetPasswordEmail = async ({
  email,
  userId,
}: resetPasswordEmailProps): Promise<ApiRepsonse> => {
  try {
    const token = await bcrypt.hash(userId, 10);
    const user = await User.find({ email });
    const username = user[0].username;
    await User.findByIdAndUpdate(userId, {
      $set: {
        forgotPasswordToken: token,
        forgotPasswordTokenExpiry: Date.now() + 3600000,
      },
    });

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: process.env.NEXT_PUBLIC_USER,
        pass: process.env.NEXT_PUBLIC_PASS,
      },
    });


    const info = await transporter.sendMail({
      from: "bansalcb2021@gmail.com",
      to: email,
      subject: "Password Reset Request",
      html: resetPasswordEmail({ token, username }),
    });

    if (info?.messageId) {
      return {
        success: true,
        message: "Email sent successfully.",
      };
    } else {
      return { success: false, message: `Error in sending email to ${email}.` };
    }
  } catch (err: any) {
    console.error("Something went wrong!", err);
    return { success: false, message: "Something went wrong!" };
  }
};
