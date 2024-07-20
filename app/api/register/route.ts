import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models";
import dbConnect from "@/db/dbConnect";
import { sendVerificationEmail } from "@/sendVerificationEmail";

const sendMail = async (
  email: string,
  username: string,
  verifyCode: string
) => {
  const emailResponse = await sendVerificationEmail({
    email,
    username,
    verifyCode,
  });

  if (!emailResponse.success) {
    return NextResponse.json({
      success: false,
      message: emailResponse.message,
    });
  }

  return NextResponse.json({
    success: true,
    message: "A 4 digit verification code has been sent to your email.",
  });
};

export const POST = async (request: NextRequest) => {
  await dbConnect();

  try {
    // the logic is that
    // 1. if a user registers with a email for first time then just check whether the username is
    //  already taken or not if taken exit the process else create user

    // 2. if a user tries to register with a email which already exits in database means that
    // someone has registered with that email before check if the email is verified or not
    //  if it is verified then exit  the process but if not verified (assuming that the username is also same)

    //  if the email is not verified then i am checking whether the code is expired or not means the user
    //  is requesting for the code again within the same time or after the code has expired
    // i am checking this because the condition is if a user registers with a email a code will be send to their
    // email and the username with which they registered will get blocked so that no other can use it but if the user
    //  doesn't verift their email within the code expiry then the username will be available for anyone
    // so if the code is expired then we have to check whther someone has taken that username or not
    // if yes exit the process
    // if no then resend the email

    const { username, email, password } = await request.json();

    // check if the user is already stored on database or it is a new user

    const isUser = await User.findOne({ email });

    const hashedPassword = await bcrypt.hash(password, 10);
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1);

    let verifyCode = Math.floor(1000 + Math.random() * 9000).toString();

    // if the user is found
    if (isUser) {
      if (isUser.isVerified) {
        // user verified with the email
        return NextResponse.json({
          success: false,
          message: "User already exists with this email",
        });
      } else {
        const isCodeNotExpired = await User.findOne({
          username,
          verifyCodeExpiry: { $gt: Date.now() },
        });
        if (isCodeNotExpired) {

          await User.findByIdAndUpdate(isUser._id,{
            $set:{
              password: hashedPassword,
              verifyCode,
              verifyCodeExpiry: expiryDate,
            }
          })
          
          // code not expired means  user somehow close the otp modal so he is registering again with same email
          return sendMail(email, username, verifyCode);
        } else {
          // code expired then the username will be available for anyone
          const isExistingUsername = await User.findOne({
            // same username and same email
            username,
          });
          if (isExistingUsername) {
            // same username and same email
            return NextResponse.json({
              success: false,
              message: "Username already taken!",
            });
          } else {
            
            await User.findByIdAndUpdate(isUser._id,{
              $set:{
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
              }
            })
            
            return sendMail(email, username, verifyCode);
          }
        }
      }
    } else {
      // user not found
      const isUsernameVerified = await User.findOne({
        // check for the username
        username,
        isVerified: true,
      });
      if (isUsernameVerified) {
        // verified return
        return NextResponse.json({
          success: false,
          message: "Username already taken!",
        });
      }

      // not verified

      await new User({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isAcceptingMessages: true,
        messages: [],
      }).save();
    }

    return sendMail(email, username, verifyCode);
  } catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json({
      success: false,
      message: "Error in registering the user",
    });
  }
};
