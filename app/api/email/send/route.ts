// app/api/emails/send/route.ts
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer"; 

export async function POST(req: NextRequest) {
  const { recipients, subject, body } = await req.json();

 
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  for (const email of recipients) {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject,
      text: body,
    });
  }

  return NextResponse.json({ success: true });
}
