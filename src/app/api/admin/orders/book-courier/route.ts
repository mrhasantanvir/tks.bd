import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const sessionCookie = cookies().get("user_session");
  if (!sessionCookie) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const session = JSON.parse(sessionCookie.value);
    const user = await prisma.users.findUnique({ where: { id: session.id } });
    if (user?.role !== 'admin') return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { order_id, courier_id } = await req.json();

    // 1. Fetch Order
    const order = await prisma.orders.findUnique({
      where: { id: order_id },
      include: {
        users: true,
        addresses: { include: { districts: true, areas: true } }
      }
    });

    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    // 2. Fetch Courier Config
    const courier = await prisma.couriers.findUnique({
      where: { id: Number(courier_id) }
    });

    if (!courier || !courier.is_active) {
      return NextResponse.json({ error: "Courier not found or inactive" }, { status: 400 });
    }

    const config = courier.api_config as any;
    if (!config) return NextResponse.json({ error: "Courier API not configured" }, { status: 400 });

    // 3. Dispatch to specific courier logic
    let result: any = { success: false, message: "Provider not implemented yet" };

    if (courier.name === 'Steadfast') {
      // Re-use logic from steadfast route or implement here
      const payload = {
        invoice: `TKS-${order.id}`,
        recipient_name: order.addresses?.receiver_name,
        recipient_phone: order.addresses?.receiver_mobile,
        recipient_address: order.addresses?.address_details,
        cod_amount: order.payment_status === 'unpaid' ? Number(order.grand_total) : 0,
        note: "Organic produce"
      };

      // Mocking API Call
      console.log("Steadfast Booking with Config:", config);
      const mockTracking = `SF${Math.floor(100000 + Math.random() * 900000)}`;
      result = { success: true, tracking_number: mockTracking, provider: 'Steadfast' };
    } 
    else if (courier.name === 'Pathao') {
      console.log("Pathao Booking with Config:", config);
      // Pathao needs Client ID, Secret, Store ID
      const mockTracking = `PT${Math.floor(100000 + Math.random() * 900000)}`;
      result = { success: true, tracking_number: mockTracking, provider: 'Pathao' };
    }
    else if (courier.name === 'RedX') {
       console.log("RedX Booking with Token:", config.token);
       const mockTracking = `RX${Math.floor(100000 + Math.random() * 900000)}`;
       result = { success: true, tracking_number: mockTracking, provider: 'RedX' };
    }

    if (result.success) {
      // Save Tracking Number
      await prisma.order_packages.create({
        data: {
          order_id: order.id,
          courier_name: courier.name,
          tracking_number: result.tracking_number,
          package_status: 'processing',
        }
      });

      // Update Order Status to Confirmed if pending
      if (order.order_status === 'pending') {
        await prisma.orders.update({
          where: { id: order.id },
          data: { order_status: 'confirmed' }
        });
      }

      return NextResponse.json({ success: true, tracking_number: result.tracking_number, message: `Successfully booked with ${courier.name}` });
    } else {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Booking process failed" }, { status: 500 });
  }
}
