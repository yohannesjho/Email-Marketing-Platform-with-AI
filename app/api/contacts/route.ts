import { NextRequest, NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";
import { getUserFromToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromToken();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "5");

    const skip = (page - 1) * limit;

    const contacts = await prisma.contact.findMany({
      where: { userId: user.id },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(contacts);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch contacts" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const user = await getUserFromToken();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

   const { name, email, tags } = await req.json();

   const contact = await prisma.contact.create({
     data: {
       name,
       email,
       userId: user.id,
       tags
     },
   });
    return NextResponse.json(contact);
  } catch (error) {
    
    return NextResponse.json(
      { error: "Failed to create contact" },
      { status: 500 }
    );
  }
}
