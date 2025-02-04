import dbConnect from "@/db/dbConnect";
import { usernameValidation } from "@/schemas";
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI, Content } from "@google/generative-ai";
import User from "@/models";

const suggestUsernames = async (username: string) => {
  try {
    const users = await User.find({ username: 1 });
    const takenUsernames = users?.map((user) => user.username);
    // if(takenUsernames.length>0){

    const prompt = `Suggest 5 strong and available usernames that start with ${username} and follow the regex /^(?=[a-zA-Z_]+[a-zA-Z0-9_.]*)(?=[a-zA-Z0-9_]+)[a-zA-Z0-9_\.]{3,30}(?<!\.)(?!\.{2,})$/. 
      Make the suggestions similar to Instagram usernames, with a mix of words, numbers, and underscores. 
      Avoid suggesting usernames that are already taken, including ${takenUsernames?.join(
        ", "
      )}. Prioritize suggestions that are easy to remember and have a good balance of characters.
      return it without adding any list styling just like that simple username list 
      `;

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
    const model = genAI.getGenerativeModel({
      model: "gemini-pro",
    });

    const result = await model.generateContentStream(prompt);
    const response = await result.response;
    const text = response.text();
    return text.split("\n").map((username) => username.trim());
    // }
    // return [];
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return [];
  }
};

export async function GET(request: NextRequest) {
  await dbConnect();

  const { searchParams } = new URL(request.url);
  const queryParams = {
    username: searchParams.get("username"),
  };

  const result = usernameValidation.safeParse(queryParams.username);

  if (!result.success) {
    return NextResponse.json({
      success: false,
      message: result?.error?.errors[0].message,
    });
  }

  const username = queryParams.username;
  const resault = await User.findOne({ email: "limal97924@kuandika.com" });

  // const users = await User.find(
  //   { verifyCodeExpiry: { $lt: Date.now() } },
  //   { username: 1 }
  // );
  const user = await User.findOne({
    username: username,
    $or: [{ verifyCodeExpiry: { $lt: Date.now() } }, { isVerified: true }],
  });
  // const existingVerifiedUser = users?.find(
  //   (user) => user.username === username
  // );
  // console.log("🚀 ~ GET ~ existingVerifiedUser:", existingVerifiedUser);

  // it will be in the form of
  // existingVerifiedUser: { _id: new ObjectId(''), username: 'some username' }

  if (user) {
    const suggestedUsernames = await suggestUsernames(user?.username);
    return NextResponse.json(
      {
        success: false,
        message: "Username is already taken",
        suggestedUsernames,
      },
      { status: 200 }
    );
  }

  return NextResponse.json(
    {
      success: true,
      message: "Username is unique",
    },
    { status: 200 }
  );
}
