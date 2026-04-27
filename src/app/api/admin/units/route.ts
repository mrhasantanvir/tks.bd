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

export async function GET() {
  const units = await prisma.units.findMany();
  return NextResponse.json({ units });
}

export async function POST(req: Request) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name } = await req.json();
  const unit = await prisma.units.upsert({
    where: { name },
    update: { name },
    create: { name }
  });
  return NextResponse.json({ success: true, unit });
}

export async function DELETE(req: Request) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID missing" }, { status: 400 });

  await prisma.units.delete({ where: { id: Number(id) } });
  return NextResponse.json({ success: true });
}
