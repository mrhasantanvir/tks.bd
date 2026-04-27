import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const { mobile, otp } = await request.json();

  if (!mobile || !otp) {
    return NextResponse.json({ error: "Mobile and OTP are required" }, { status: 400 });
  }

  try {
    const user = await prisma.users.findUnique({
      where: { mobile_number: mobile },
    });

    if (!user || user.otp_code !== otp) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    if (user.otp_expiry && new Date() > user.otp_expiry) {
      return NextResponse.json({ error: "OTP expired" }, { status: 400 });
    }

    // Clear OTP and verify user
    await prisma.users.update({
      where: { id: user.id },
      data: {
        otp_code: null,
        otp_expiry: null,
        is_verified: true,
      },
    });

    // Set Session Cookie (Simplified for now)
    cookies().set("user_session", JSON.stringify({ id: user.id, role: user.role }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    return NextResponse.json({ message: "Verified successfully", user });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
