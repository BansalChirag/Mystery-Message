import User from "@/models";
import { GoogleGenerativeAI, Content } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json();
    const users = await User.find({}, { username: 1 });
    const takenUsernames = users?.map((user) => user.username);
    // const prompt = "Suggest 5 available usernames that should follow the regex /^(?=[a-zA-Z_]+[a-zA-Z0-9_.]*)(?=[a-zA-Z0-9_]+)[a-zA-Z0-9_\.]{3,30}(?<!\.)(?!\.{2,})$/
    // and not equal to these takenUsernames.map((username))
    // ";

    // const prompt = `Suggest best strong 5 available usernames that should start with ${username} and should follow the regex /^(?=[a-zA-Z_]+[a-zA-Z0-9_.]*)(?=[a-zA-Z0-9_]+)[a-zA-Z0-9_\.]{3,30}(?<!\.)(?!\.{2,})$/
    // and are not equal to ${takenUsernames.join(", ")}.`;

    const prompt = `Suggest 5 strong and available usernames that start with ${username} and follow the regex /^(?=[a-zA-Z_]+[a-zA-Z0-9_.]*)(?=[a-zA-Z0-9_]+)[a-zA-Z0-9_\.]{3,30}(?<!\.)(?!\.{2,})$/. 
Make the suggestions similar to Instagram usernames, with a mix of words, numbers, and underscores. 
Avoid suggesting usernames that are already taken, including ${takenUsernames.join(
      ", "
    )}. 
Prioritize suggestions that are easy to remember and have a good balance of characters.
return it without adding any list styling just like that simple username list 
`;

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
    const model = genAI.getGenerativeModel({
      model: "gemini-pro",
    });

    const result = await model.generateContentStream(prompt);
    const response = await result.response;
    const text = response.text();
    return NextResponse.json({ data: text }, { status: 200 });
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return NextResponse.json({ error });
  }
}
