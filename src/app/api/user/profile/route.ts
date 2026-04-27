import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const sessionCookie = cookies().get("user_session");
  if (!sessionCookie) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const session = JSON.parse(sessionCookie.value);
    const user = await prisma.users.findUnique({
      where: { id: session.id },
      include: { addresses: { include: { districts: true } } }
    });

    const announcements = await prisma.site_announcements.findMany({
      orderBy: { created_at: 'desc' }
    });

    return NextResponse.json({ user, announcements });
  } catch (err) {
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  }
}
