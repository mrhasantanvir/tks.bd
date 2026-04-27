import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

async function verifyAdmin() {
  const sessionCookie = cookies().get("user_session");
  if (!sessionCookie) return null;
  const session = JSON.parse(sessionCookie.value);
  const user = await prisma.users.findUnique({ where: { id: session.id } });
  return user?.role === 'admin' ? user : null;
}

export async function POST(req: Request) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    
    const product = await prisma.products.create({
      data: {
        name: body.name,
        short_description: body.short_description,
        detailed_description: body.detailed_description,
        category_id: body.category_id ? Number(body.category_id) : null,
        unit_id: body.unit_id ? Number(body.unit_id) : null,
        price_per_unit: Number(body.price_per_unit),
        regular_price: body.regular_price ? Number(body.regular_price) : null,
        lot_size: Number(body.lot_size),
        packaging_charge: body.packaging_charge ? Number(body.packaging_charge) : 0,
        available_stock: Number(body.available_stock),
        image_url: body.image_url,
        allow_home_delivery: body.allow_home_delivery === 'on' || body.allow_home_delivery === true,
        allow_point_delivery: body.allow_point_delivery === 'on' || body.allow_point_delivery === true,
        available_couriers: body.available_couriers, // Now sent as JSON string from frontend
        payment_policy: body.payment_policy,
        partial_advance_val: body.partial_advance_val ? Number(body.partial_advance_val) : null,
        is_preorder: Number(body.available_stock) <= 0,
        
        product_gallery: {
          create: [
            { image_url: body.gallery_1 },
            { image_url: body.gallery_2 },
            { image_url: body.gallery_3 },
            { image_url: body.gallery_4 },
          ].filter(img => img.image_url)
        }
      }
    });
    return NextResponse.json({ success: true, product });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const id = Number(body.id);

    await prisma.products.update({
      where: { id },
      data: {
        name: body.name,
        short_description: body.short_description,
        detailed_description: body.detailed_description,
        category_id: body.category_id ? Number(body.category_id) : null,
        unit_id: body.unit_id ? Number(body.unit_id) : null,
        price_per_unit: Number(body.price_per_unit),
        regular_price: body.regular_price ? Number(body.regular_price) : null,
        lot_size: Number(body.lot_size),
        packaging_charge: body.packaging_charge ? Number(body.packaging_charge) : 0,
        available_stock: Number(body.available_stock),
        image_url: body.image_url,
        available_couriers: body.available_couriers,
        payment_policy: body.payment_policy,
        partial_advance_val: body.partial_advance_val ? Number(body.partial_advance_val) : null,
        is_preorder: Number(body.available_stock) <= 0,
      }
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "ID missing" }, { status: 400 });

  try {
    await prisma.products.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
