import dbConnect from "@/db/dbConnect";
import User, { Message } from "@/models";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const { username, content } = await request.json();
    // const user = User.findOne({username}).exec()
    const user = await User.findOne({ username });

    if (!user) {
      return Response.json(
        { message: "User not found", success: false },
        { status: 404 }
      );
    }

    // Check if the user is accepting messages
    if (!user.isAcceptingMessages)
      return Response.json(
        { message: "User is not accepting messages", success: false },
        { status: 403 } // 403 Forbidden status
      );
    const newMessage = { content, createdAt: new Date() };

    user.messages.push(newMessage as Message);
    await user.save();

    return Response.json(
      { message: "Message sent successfully", success: true },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding message:", error);
    return Response.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
