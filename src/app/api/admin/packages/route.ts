import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const sessionCookie = cookies().get("user_session");
  if (!sessionCookie) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const session = JSON.parse(sessionCookie.value);
    const user = await prisma.users.findUnique({ where: { id: session.id } });
    if (user?.role !== 'admin') return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const packages = await prisma.order_packages.findMany({
      include: {
        orders: {
          include: { users: true }
        }
      },
      orderBy: { id: 'desc' }
    });
    return NextResponse.json({ packages });
  } catch (err) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
