import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromToken } from "@/lib/auth";
export async function GET(){
    try {
        const user = await getUserFromToken();
        if(!user)
            return NextResponse.json({error: "user is not found"}, { status: 401})

        const emails = await prisma.email.findMany({
          where: { userId : user.id },
          orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(emails);
    } catch (error) {
        return NextResponse.json({message: "server error"}, { status: 500})
    }
}

export async function POST(req: Request) {
    try {
        const user = await getUserFromToken();

        if(!user) {
            return NextResponse.json({message: "Unauthorized"}, { status: 401})
        }

        const { subject, body: emailBody, scheduledAt, templateId, recipientIds, status } = await req.json();

        if(!subject || !emailBody) 
            return NextResponse.json({message: "subject and body are required"}, { status: 400})

        const email = await prisma.email.create({
            data: {
                subject,
                body: emailBody,
                scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
                templateId,
                status: status,
                userId: user.id,
                recipients: {
                    connect: recipientIds.map((id: string) => ({ id}))
                }
            }
        })
    } catch (error) {
        return NextResponse.json({message: "Failed to create email"}, { status: 500} )
    }
}