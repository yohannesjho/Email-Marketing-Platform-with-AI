import { getUserFromToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: any
) {
  try {

    const user = await getUserFromToken(req);
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const id = params.id;

    const email = await prisma.email.findFirst({
      where: {
        id,
        userId: user.id,  
      },
      include: {
        template: true,
        recipients: true,
      },
    });

    if (!email) {
      return NextResponse.json({ error: "Email not found" }, { status: 404 });
    }

    return NextResponse.json(email);
  } catch (error) {
    console.error("Error fetching email:", error);
    return NextResponse.json(
      { error: "Failed to fetch email" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: any) {
  try {
    const { id } = params;
    const user = await getUserFromToken(req);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
 
    
    const {
      subject,
      body: emailBody,
      templateId,
      recipients,
      scheduledAt,
      status,
    } = await req.json();
    console.log(subject);

    console.log(recipients);

    const email = await prisma.email.update({
      where: { id, userId: user.id },
      data: {
        subject,
        body: emailBody,
        templateId: templateId || null,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        status,
        recipients:
          recipients && recipients.length > 0
            ? { set: recipients.map((rid: string) => ({ id: rid })) }
            : undefined,
      },
    });
   
    return NextResponse.json(email);
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { message: "error updating email" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: any
) {
  try {
    const user = await getUserFromToken(req);
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = params;

    await prisma.email.delete({
      where: {
        id,
        userId: user.id,  
      },
    });

    return NextResponse.json({ message: "Email deleted" });
  } catch (error) {
    console.error("Error deleting email:", error);
    return NextResponse.json(
      { error: "Failed to delete email" },
      { status: 500 }
    );
  }
}
