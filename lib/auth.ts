import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {prisma} from '@/lib/prisma';
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey"; // put in .env

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return await bcrypt.compare(password, hash);
}

export function generateToken(userId: string) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export async function getUserFromToken(req: Request) {
  try {
   
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return null;

    // Verify token
    const decoded = verifyToken(token);

    // Extract userId from decoded token if it's a JwtPayload
    const userId =
      typeof decoded === "object" && decoded !== null && "userId" in decoded
        ? (decoded as jwt.JwtPayload).userId
        : undefined;

    // Fetch user from DB (ensures they still exist)
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    return user;
  } catch (error) {
    return null;
  }
}