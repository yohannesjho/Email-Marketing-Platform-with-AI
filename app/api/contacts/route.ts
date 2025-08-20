import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";
import { getUserFromToken } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const user = await getUserFromToken(req);
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const contacts = await prisma.contact.findMany({
      where: { userId: user.id },
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
    const user = await getUserFromToken(req);
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

   const { name, email, tags } = await req.json();

   const tagData = tags?.map((tagName: string) => ({
     where: { value: tagName },
     create: { value: tagName },
   }));

   const contact = await prisma.contact.create({
     data: {
       name,
       email,
       userId: user.id,
       tags: { connectOrCreate: tagData },
     },
   });
    return NextResponse.json(contact);
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: "Failed to create contact" },
      { status: 500 }
    );
  }
}
