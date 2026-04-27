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

    // Calculate stats
    const totalOrders = await prisma.orders.count();
    const activeOrders = await prisma.orders.count({
      where: { order_status: { in: ['pending', 'confirmed', 'partially_shipped'] } }
    });

    const sumSales = await prisma.orders.aggregate({
      _sum: { grand_total: true },
      where: { payment_status: 'paid' }
    });
    
    const totalCustomers = await prisma.users.count({ where: { role: 'customer' } });

    const avgRatingAgg = await prisma.reviews.aggregate({ _avg: { rating: true } });

    return NextResponse.json({ 
      stats: {
        totalSales: sumSales._sum.grand_total || 0,
        activeOrders,
        totalOrders,
        totalCustomers,
        avgRating: avgRatingAgg._avg.rating || 0
      }
    });
  } catch (err) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
