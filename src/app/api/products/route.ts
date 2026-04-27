import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const products = await prisma.products.findMany({
      include: {
        categories: true,
        units: true,
        product_gallery: true,
      },
      orderBy: { created_at: 'desc' }
    });
    return NextResponse.json({ products });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
