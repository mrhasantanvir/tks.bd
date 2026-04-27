import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const sessionCookie = cookies().get("user_session");
  if (!sessionCookie) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { 
      items, 
      address_id, 
      district_id, 
      upazila_id,
      address_details,
      delivery_type, 
      package_couriers, 
      payment_method 
    } = await request.json();

    const session = JSON.parse(sessionCookie.value);
    const userId = session.id;

    // 0. Ensure Address exists or create new one
    let finalAddressId = address_id;
    let currentAddress: any = null;

    if (!finalAddressId) {
      const newAddress = await prisma.addresses.create({
        data: {
          user_id: userId,
          district_id: district_id,
          upazila_id: upazila_id,
          full_address: address_details,
          is_default: true
        }
      });
      finalAddressId = newAddress.id;
      currentAddress = newAddress;
    } else {
      currentAddress = await prisma.addresses.findUnique({ where: { id: finalAddressId } });
    }

    const user = await prisma.users.findUnique({ where: { id: userId } });

    // 1. Fetch all necessary data for validation
    const products = await prisma.products.findMany({
      where: { id: { in: items.map((i: any) => i.id) } },
      include: { categories: true }
    });

    const configs = await prisma.shipping_configs.findMany({
      include: { couriers: true }
    });

    const district = await prisma.districts.findUnique({ where: { id: district_id || currentAddress?.district_id } });

    // 2. Group items by harvest date (Packages)
    const packagesMap: Record<string, any[]> = {};
    items.forEach((item: any) => {
      const product = products.find(p => p.id === item.id);
      const date = product?.harvest_date?.toISOString().split('T')[0] || "General";
      if (!packagesMap[date]) packagesMap[date] = [];
      packagesMap[date].push({ ...item, product });
    });

    let totalProductPrice = 0;
    let totalShippingCost = 0;
    const orderPackagesData: any[] = [];

    // 3. Calculate costs and prepare packages
    for (const [date, pkgItems] of Object.entries(packagesMap)) {
      const selectedCourierName = package_couriers[`pkg-${date}`];
      const courier = await prisma.couriers.findFirst({ where: { name: selectedCourierName } });
      
      let pkgShipping = 0;
      let pkgWeight = 0;
      let maxFixed = 0;

      pkgItems.forEach(item => {
        const itemPrice = Number(item.product.price_per_unit) * item.lotSize * item.quantity;
        const itemPkgCharge = Number(item.product.packaging_charge || 0) * item.quantity;
        totalProductPrice += (itemPrice + itemPkgCharge);
        
        const weight = item.lotSize * item.quantity;
        pkgWeight += weight;

        const config = configs.find(c => 
          c.courier_id === courier?.id && 
          (c.category_id === item.product.category_id || !c.category_id)
        );

        if (config) {
          let rate = 0;
          if (district?.is_dhaka) {
            rate = delivery_type === "home" ? Number(config.dhaka_home_rate) : Number(config.dhaka_office_rate);
          } else {
            rate = delivery_type === "home" ? Number(config.outside_home_rate) : Number(config.outside_office_rate);
          }

          if (config.is_weight_based) {
            pkgShipping += (weight * rate);
          } else {
            maxFixed = Math.max(maxFixed, rate);
          }
        } else {
          maxFixed = Math.max(maxFixed, 60);
        }
      });

      const finalPkgShipping = pkgShipping + maxFixed;
      totalShippingCost += finalPkgShipping;

      orderPackagesData.push({
        courier_id: courier?.id,
        weight: pkgWeight,
        shipping_cost: finalPkgShipping,
        package_status: 'waiting_for_harvest'
      });
    }

    // 4. Create Order in Transaction
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.orders.create({
        data: {
          user_id: userId,
          address_id: finalAddressId,
          total_product_price: totalProductPrice,
          total_shipping_cost: totalShippingCost,
          grand_total: totalProductPrice + totalShippingCost,
          order_status: 'pending',
          payment_status: 'unpaid',
          payment_method: payment_method,
          order_items: {
            create: items.map((item: any) => ({
              product_id: item.id,
              quantity: item.quantity,
              price: products.find(p => p.id === item.id)?.price_per_unit,
              harvest_date: products.find(p => p.id === item.id)?.harvest_date
            }))
          },
          order_packages: {
            create: orderPackagesData
          }
        }
      });

      return newOrder;
    });

    // 5. Trigger SMS Notifications (Non-blocking)
    const { sendTemplateSMS } = await import("@/lib/sms");
    
    sendTemplateSMS('order_confirm', {
      to: user?.mobile_number || "",
      order_id: order.id,
      amount: order.grand_total.toString()
    }).catch(e => console.error("Customer SMS Failed", e));

    sendTemplateSMS('admin_alert', {
      order_id: order.id,
      name: user?.full_name || "N/A",
      mobile: user?.mobile_number || "N/A"
    }).catch(e => console.error("Admin SMS Failed", e));

    return NextResponse.json({ success: true, order_id: order.id });

  } catch (err: any) {
    console.error("Checkout Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
