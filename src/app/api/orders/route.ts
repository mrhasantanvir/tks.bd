import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const sessionCookie = cookies().get("user_session");
  if (!sessionCookie) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const session = JSON.parse(sessionCookie.value);
    const userId = session.id;

    const orders = await prisma.orders.findMany({
      where: { user_id: userId },
      include: {
        order_items: { include: { products: true } },
        order_packages: { include: { couriers: true } }
      },
      orderBy: { created_at: 'desc' }
    });

    return NextResponse.json({ orders });
  } catch (err) {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
