import { NextResponse } from "next/server";
import { generateTemplate } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const template = await generateTemplate(prompt);

    return NextResponse.json(template);
  } catch (error) {
    console.error("Gemini error:", error);
    return NextResponse.json(
      { error: "AI generation failed" },
      { status: 500 }
    );
  }
}
