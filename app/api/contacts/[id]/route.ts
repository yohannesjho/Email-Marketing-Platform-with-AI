import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";
import { getUserFromToken } from "@/lib/auth";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromToken(req);
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, email, tags } = await req.json();

  const tagData = tags?.map((tagValue: string) => ({
    where: { value: tagValue },
    create: { value: tagValue },
  }));

  const contact = await prisma.contact.update({
    where: { id: params.id, userId: user.id },
    data: {
      name,
      email,
      tags: { set: [], connectOrCreate: tagData }, // replaces old tags
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
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromToken(req);
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await prisma.contact.delete({
      where: { id: params.id, userId: user.id },
    });

    return NextResponse.json({ message: "Contact deleted" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete contact" },
      { status: 500 }
    );
  }
}
