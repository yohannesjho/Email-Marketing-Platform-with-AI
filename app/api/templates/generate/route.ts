import { NextRequest, NextResponse } from "next/server";
import { generateTemplate } from "@/lib/gemini";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }
   
    const user = await getUserFromToken(req)

    if(!user) {
      return NextResponse.json({message: "Unautorized"}, {status: 401})
    }
    
    const generatedTemplate  = await generateTemplate(prompt);

  
    const registeredTemplate = await prisma.template.create({
      data: {
        name: generateTemplate.name,
        subject: generatedTemplate.subject,
        body: generatedTemplate.body,
        userId: user.id
      }
    })

    return NextResponse.json(registeredTemplate);
  } catch (error) {
    console.error("Gemini error:", error);
    return NextResponse.json(
      { error: "AI generation failed" },
      { status: 500 }
    );
  }
}
