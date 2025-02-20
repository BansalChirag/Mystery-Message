import { GoogleGenerativeAI, Content } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
    const model = genAI.getGenerativeModel({
      model: "gemini-pro",
    });

    const result = await model.generateContentStream(prompt);
    const response = await result.response;
    const text = response.text();
    return NextResponse.json({data: text,message:"Messages Successfully generated."},{status:200});
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return NextResponse.json({ error });
  }
}