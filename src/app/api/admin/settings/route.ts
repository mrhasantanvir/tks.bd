import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// Fetch all settings
export async function GET() {
  const sessionCookie = cookies().get("user_session");
  if (!sessionCookie) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const session = JSON.parse(sessionCookie.value);
    const user = await prisma.users.findUnique({ where: { id: session.id } });
    if (user?.role !== 'admin') return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const settings = await prisma.settings.findMany();
    return NextResponse.json({ settings });
  } catch (err) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

// Update settings
export async function POST(req: Request) {
  const sessionCookie = cookies().get("user_session");
  if (!sessionCookie) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const session = JSON.parse(sessionCookie.value);
    const user = await prisma.users.findUnique({ where: { id: session.id } });
    if (user?.role !== 'admin') return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { key, value } = await req.json();
    
    const setting = await prisma.settings.upsert({
      where: { key },
      update: { value },
      create: { key, value }
    });

    return NextResponse.json({ success: true, setting });
  } catch (err) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
