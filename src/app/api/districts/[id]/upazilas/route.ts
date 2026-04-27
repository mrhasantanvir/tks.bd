import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const upazilas = await prisma.upazilas.findMany({
      where: { district_id: parseInt(params.id) },
      orderBy: { name: 'asc' }
    });
    return NextResponse.json({ upazilas });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch upazilas" }, { status: 500 });
  }
}
