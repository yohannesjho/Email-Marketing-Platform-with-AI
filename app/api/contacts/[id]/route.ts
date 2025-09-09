import { NextRequest, NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";
import { getUserFromToken } from "@/lib/auth";

export async function PUT(
  req: NextRequest,
  context: { params: { id: string }}
) {
  try {
    const { id } = context.params;
    const user = await getUserFromToken(req);
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, email, tags } = await req.json();

  const contact = await prisma.contact.update({
    where: { id: id, userId: user.id },
    data: {
      name,
      email,
      tags 
    },
  });


    return NextResponse.json(contact);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update contact" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;  

    const user = await getUserFromToken(req);
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await prisma.contact.delete({
      where: { id }, 
    });

    return NextResponse.json({ message: "Contact deleted" });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete contact" },
      { status: 500 }
    );
  }
}



