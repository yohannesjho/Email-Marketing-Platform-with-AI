import { NextResponse } from 'next/server';
import {prisma} from '@/lib/prisma';
import { generateToken, verifyPassword } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        
         if (!email || !password) {
           return NextResponse.json(
             { error: "Missing fields" },
             { status: 400 }
           );
         }

        const user = await prisma.user.findUnique({where:{email}});

        if(!user) {
            return NextResponse.json({error: "invalid credentials"}, {status: 404})
        }

        if(!await verifyPassword(password, user.password)) {
            return NextResponse.json({error: "invalid credentials"}, {status: 401})

        }

        const token = generateToken(user.id);

        const res = NextResponse.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        });

        return res;

    } catch (error) {
        console.error(error);
        return NextResponse.json({error: "server error"}, {status: 500});
    }
}