import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { amount, order_id } = await req.json();

    // Fetch Nagad credentials
    const settings = await prisma.settings.findMany({
      where: { key: { in: ['nagad_merchant_id', 'nagad_public_key', 'nagad_private_key'] } }
    });

    const config: any = {};
    settings.forEach(s => config[s.key] = s.value);

    if (!config.nagad_merchant_id) {
      return NextResponse.json({ error: "Nagad credentials not configured" }, { status: 400 });
    }

    console.log(`Initiating Nagad payment for order ${order_id} with amount ${amount}`);
    
    // Logic for Nagad Sensitive Data encryption and Initialization goes here
    
    return NextResponse.json({ 
      success: true, 
      gateway_url: "https://sandbox.mynagad.com:10080/...", 
      message: "Nagad payment structure ready" 
    });
  } catch (err) {
    return NextResponse.json({ error: "Nagad payment failed" }, { status: 500 });
  }
}
