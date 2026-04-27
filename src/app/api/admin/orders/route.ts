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

export async function PATCH(request: Request) {
  const sessionCookie = cookies().get("user_session");
  if (!sessionCookie) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { order_id, status, package_id } = await request.json();
    const session = JSON.parse(sessionCookie.value);
    const user = await prisma.users.findUnique({ where: { id: session.id } });
    
    if (user?.role !== 'admin') {
      return NextResponse.json({ error: "Access Denied" }, { status: 403 });
    }

    if (package_id) {
      // Update specific package status
      const pkg = await prisma.order_packages.findUnique({
        where: { id: package_id },
        include: { 
          orders: { include: { addresses: { include: { districts: true } } } },
          couriers: true
        }
      });

      if (!pkg) return NextResponse.json({ error: "Package not found" }, { status: 404 });

      let tracking_number = pkg.tracking_number;

      // Trigger Automated Booking if status changed to shipped and courier is online
      if (status === 'shipped' && pkg.couriers?.type === 'online' && !pkg.tracking_number) {
        const { bookWithCourier } = await import("@/lib/couriers");
        const courierConfig = pkg.couriers.api_config as any;

        if (!courierConfig?.api_key) {
           console.error("API Key missing for courier:", pkg.couriers.name);
        } else {
          const bookingRes = await bookWithCourier(pkg.couriers.name, {
            invoice_id: `TKS-${pkg.orders?.id}-${pkg.id}`,
            recipient_name: pkg.orders?.addresses?.receiver_name || "Customer",
            recipient_phone: pkg.orders?.addresses?.receiver_mobile || "",
            recipient_address: pkg.orders?.addresses?.address_details || "",
            cod_amount: Number(pkg.orders?.grand_total || 0),
            weight: Number(pkg.weight || 1),
          }, {
            api_key: courierConfig.api_key,
            secret_key: courierConfig.secret_key,
          });

          if (bookingRes.success) {
            tracking_number = bookingRes.tracking_number || "";
          }
        }
      }

      // Trigger Shipment SMS
      if (status === 'shipped') {
        const { sendTemplateSMS } = await import("@/lib/sms");
        sendTemplateSMS('order_shipped', {
          to: pkg.orders?.addresses?.receiver_mobile || "",
          order_id: pkg.orders?.id,
          tracking: tracking_number || pkg.tracking_number || "Processing"
        }).catch(e => console.error("Shipment SMS Failed", e));
      }

      await prisma.order_packages.update({
        where: { id: package_id },
        data: { package_status: status as any, tracking_number }
      });
    } else if (order_id) {
      await prisma.orders.update({
        where: { id: order_id },
        data: { order_status: status as any }
      });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Order Update Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
