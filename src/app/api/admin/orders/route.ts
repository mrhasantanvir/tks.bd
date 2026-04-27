import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const sessionCookie = cookies().get("user_session");
  if (!sessionCookie) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const session = JSON.parse(sessionCookie.value);
    const user = await prisma.users.findUnique({ where: { id: session.id } });
    
    if (user?.role !== 'admin') {
      return NextResponse.json({ error: "Access Denied" }, { status: 403 });
    }

    const orders = await prisma.orders.findMany({
      include: {
        users: true,
        addresses: { include: { districts: true } },
        order_items: { include: { products: true } }
      },
      orderBy: { created_at: 'desc' }
    });

    return NextResponse.json({ orders });
  } catch (err) {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
