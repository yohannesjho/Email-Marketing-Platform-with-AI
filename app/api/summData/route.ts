import { getUserFromToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {

    const user = await getUserFromToken(req);

    console.log("User from token:", user);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const emails = await prisma.email.count({
      where: { userId: user.id },
    });

    const scheduledEmails = await prisma.email.count({
      where: { userId: user.id, status: "SCHEDULED" },
    });
    const contacts = await prisma.contact.count({
      where: { userId: user.id },
    });
    const templates = await prisma.template.count({
      where: { userId: user.id },
    });

    return NextResponse.json({ emails, scheduledEmails, contacts, templates });

  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }

}