import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

async function verifyAdmin() {
  const sessionCookie = cookies().get("user_session");
  if (!sessionCookie) return null;
  const session = JSON.parse(sessionCookie.value);
  const user = await prisma.users.findUnique({ where: { id: session.id } });
  return user?.role === 'admin' ? user : null;
}

export async function GET(req: Request) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const category_id = searchParams.get("category_id");

    const where = category_id ? { category_id: Number(category_id) } : {};
    // @ts-ignore
    const lots = await prisma.lots.findMany({
      where,
      include: { categories: true }
    });
    return NextResponse.json({ lots });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch lots" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    // @ts-ignore
    const lot = await prisma.lots.create({
      data: {
        name: body.name,
        size: Number(body.size),
        packaging_charge: Number(body.packaging_charge),
        category_id: Number(body.category_id)
      }
    });
    return NextResponse.json({ success: true, lot });
  } catch (err) {
    return NextResponse.json({ error: "Failed to create lot" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "ID missing" }, { status: 400 });

  try {
    // @ts-ignore
    await prisma.lots.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete lot" }, { status: 500 });
  }
}
