import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/lib/auth";
export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromToken(req);
    if (!user)
      return NextResponse.json({ error: "user is not found" }, { status: 401 });

    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '5')

    

    const skip = (page -1 ) * limit;

    const emails = await prisma.email.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        recipients: true,
      },
    });

    const totalCount = await prisma.email.count({
      where:{userId: user.id}
    })

    return NextResponse.json({emails, totalCount}, {status: 200});
  } catch (error) {
    return NextResponse.json({ message: "server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromToken(req);

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const {
      subject,
      body: emailBody,
      scheduledAt,
      templateId,
      recipients,
      status,
    } = await req.json();

    if (!subject || !emailBody)
      return NextResponse.json(
        { message: "subject and body are required" },
        { status: 400 }
      );

    const email = await prisma.email.create({
      data: {
        subject,
        body: emailBody,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        templateId: templateId || null,
        status: status,
        userId: user.id,
        recipients:
          recipients && recipients.length > 0
            ? { connect: recipients.map((rid: string) => ({ id: rid })) }
            : undefined,
      },
    });

    return NextResponse.json(email);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to create email" },
      { status: 500 }
    );
  }
}
