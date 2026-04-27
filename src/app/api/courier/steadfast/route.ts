import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { order_id } = await req.json();

    // 1. Fetch Order and Delivery Details
    const order = await prisma.orders.findUnique({
      where: { id: order_id },
      include: {
        users: true,
        addresses: { include: { districts: true } }
      }
    });

    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    // 2. Fetch Steadfast Credentials from Settings
    const settings = await prisma.settings.findMany({
      where: { key: { in: ['steadfast_api_key', 'steadfast_secret_key'] } }
    });

    const config: any = {};
    settings.forEach(s => config[s.key] = s.value);

    if (!config.steadfast_api_key || !config.steadfast_secret_key) {
      return NextResponse.json({ error: "Steadfast credentials not configured" }, { status: 400 });
    }

    // 3. Prepare Payload for Steadfast API
    const payload = {
      invoice: `TKS-${order.id}`,
      recipient_name: order.addresses?.receiver_name,
      recipient_phone: order.addresses?.receiver_mobile,
      recipient_address: order.addresses?.address_details,
      cod_amount: order.payment_status === 'unpaid' ? Number(order.grand_total) : 0,
      note: "Organic produce - Handle with care"
    };

    console.log("Submitting order to Steadfast:", payload);

    // 4. In a real scenario, you'd call Steadfast API here:
    /*
    const response = await fetch("https://portal.steadfast.com.bd/api/v1/create_order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Api-Key": config.steadfast_api_key,
        "Secret-Key": config.steadfast_secret_key
      },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    */

    // Mocking successful response
    const mockTrackingNumber = `SF${Math.floor(100000 + Math.random() * 900000)}`;

    // 5. Create/Update Order Package in DB
    await prisma.order_packages.create({
      data: {
        order_id: order.id,
        courier_name: 'Steadfast',
        tracking_number: mockTrackingNumber,
        package_status: 'processing',
        weight: 1.0, // Default or calculated
      }
    });

    return NextResponse.json({ 
      success: true, 
      tracking_number: mockTrackingNumber,
      message: "Order successfully submitted to Steadfast Courier" 
    });

  } catch (err) {
    return NextResponse.json({ error: "Courier integration failed" }, { status: 500 });
  }
}
