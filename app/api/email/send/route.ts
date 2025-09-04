// app/api/emails/send/route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer"; // or resend/sendgrid SDK

export async function POST(req: Request) {
  const { recipients, subject, body } = await req.json();

  // example: nodemailer
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
