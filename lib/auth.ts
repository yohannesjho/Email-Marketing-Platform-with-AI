import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {prisma} from '@/lib/prisma';
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey"; // put in .env

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return await bcrypt.compare(password, hash);
}

export function generateToken(id: string) {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: "1h" });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export async function getUserFromToken(req: NextRequest) {
 const authHeader = req.headers.get("authorization");
 if (!authHeader?.startsWith("Bearer ")) return null;

 const token = authHeader.split(" ")[1];
 try {
   const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
   return decoded;
 } catch {
   return null;
 }
}