import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const districts = await prisma.districts.findMany({
      orderBy: { name: 'asc' }
    });
    return NextResponse.json({ districts });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch districts" }, { status: 500 });
  }
}
