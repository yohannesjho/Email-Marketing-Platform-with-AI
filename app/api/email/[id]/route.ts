import { getUserFromToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromToken();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const email = await prisma.email.findFirst({
      where: {
        id: params.id,
        userId: user.id, // secure — only fetch user’s own email
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

export async function PUT(req: Request, {params}: { params: {id: string}}) {
     try {
         const user = await getUserFromToken()

         if(!user) {
            return NextResponse.json({error: "Unauthorized"}, { status: 401})
         }

        const {
          subject,
          body: emailBody,
          templateId,
          recipientIds,
          scheduledAt,
          status,
        } = await req.json()

        const email = prisma.email.update({
            where: {id: params.id, userId: user.id},
            data: {
                subject,
                body: emailBody,
                templateId,
                scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
                status,
                recipients: {
                    connect: recipientIds.map((id: string) => ({ id }))
                }
            }
        })

        return NextResponse.json(email)
     } catch(error) {
         return NextResponse.json({message: "error updating email"}, { status: 500})
     }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromToken();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await prisma.email.delete({
      where: {
        id: params.id,
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
