import { NextRequest, NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";
import { getUserFromToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromToken(req);
    console.log(user);
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

    const totalCount = await prisma.contact.count({
      where:{userId: user.id}
    })

    return NextResponse.json({contacts, totalCount}, {status:200});
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch contacts" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromToken(req);
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
