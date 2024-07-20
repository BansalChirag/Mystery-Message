import dbConnect from "@/db/dbConnect";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";
import User from "@/models";

export async function GET(request: NextRequest) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const _user = session?.user;

  if (!session || !_user) {
    return Response.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }

  const userId = new mongoose.Types.ObjectId(_user._id);
  try {
    const user = await User.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]).exec();

    // if (!user || user.length === 0) {
    //   return Response.json(
    //     { message: "User not found", success: false },
    //     { status: 404 }
    //   );
    // }

    return Response.json(
      { messages: user[0]?.messages || [] ,success: true}
    );
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return Response.json(
      { message: "Something went wrong!", success: false },
      { status: 500 }
    );
  }
}
