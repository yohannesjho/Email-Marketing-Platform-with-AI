import { getUserFromToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params } : { params: { id: string}}) {
    try {
        const user = await getUserFromToken();

        if(!user) {
            return NextResponse.json({message: "Unauthorized"}, { status: 401})
        }

        const template = await prisma.template.findFirst({
            where: {id: params.id, userId: user.id},
            include: {
                emails: true
            }
        })
        

        return NextResponse.json(template)
    } catch (error) {
        console.log(error)
        return NextResponse.json({message: "Internal Server Error"}, { status: 500})
    }
}

export async function PUT(req: Request, { params } : { params: { id: string}}) {
    try {
        const user = await getUserFromToken();

        if(!user) {
            return NextResponse.json({message: "Unauthorized"}, { status: 401})
        }

        const body = await req.json();

        const { name, subject, body: templateBody } = body

        if( !name || !subject || !templateBody ) {
            return NextResponse.json({message: "Missing fields"}, { status: 400})
        }

        const template = await prisma.template.update({
            where: { id: params.id, userId: user.id },
            data: {
                name,
                subject,
                body: templateBody,
            }
        })

        return NextResponse.json(template)
    } catch (error) {
        console.log(error)
        return NextResponse.json({message: "Internal Server Error"}, { status: 500})
    }
}

export async function DELETE(req: Request, { params } : { params: { id: string}}) {
    try {
        const user = await getUserFromToken();

        if(!user) {
            return NextResponse.json({message: "Unauthorized"}, { status: 401})
        }

        const template = await prisma.template.delete({
            where: { id: params.id, userId: user.id }
        })

        return NextResponse.json(template)
    } catch (error) {
        console.log(error)
        return NextResponse.json({message: "Internal Server Error"}, { status: 500})
    }
}