import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const { mobile } = await request.json();

  if (!mobile) {
    return NextResponse.json({ error: "Mobile number is required" }, { status: 400 });
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry

  try {
    const user = await prisma.users.upsert({
      where: { mobile_number: mobile },
      update: {
        otp_code: otp,
        otp_expiry: expiry,
      },
      create: {
        mobile_number: mobile,
        otp_code: otp,
        otp_expiry: expiry,
        role: "customer",
      },
    });

    // Universal API Wrapper for SMS (Mocking BulkSMSBD/ElitBuzz for now)
    console.log(`[SMS API] Sending OTP ${otp} to ${mobile}`);
    
    return NextResponse.json({ message: "OTP sent successfully", demo_otp: otp });
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
