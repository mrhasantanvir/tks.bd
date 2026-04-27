import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const couriers = await prisma.couriers.findMany({
      orderBy: { name: 'asc' }
    });
    return NextResponse.json({ couriers });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch couriers" }, { status: 500 });
  }
}
