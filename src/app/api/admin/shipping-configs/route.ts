import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

async function verifyAdmin() {
  const sessionCookie = cookies().get("user_session");
  if (!sessionCookie) return null;
  try {
    const session = JSON.parse(sessionCookie.value);
    const user = await prisma.users.findUnique({ where: { id: session.id } });
    return user?.role === 'admin' ? user : null;
  } catch (e) {
    return null;
  }
}

export async function GET() {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const configs = await prisma.shipping_configs.findMany({
      include: { categories: true },
      orderBy: { courier_name: 'asc' }
    });
    return NextResponse.json({ configs });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch shipping configs" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const config = await prisma.shipping_configs.create({
      data: {
        courier_name: body.courier_name,
        category_id: body.category_id ? Number(body.category_id) : null,
        is_weight_based: body.is_weight_based === true || body.is_weight_based === 'true',
        dhaka_office_rate: Number(body.dhaka_office_rate),
        outside_office_rate: Number(body.outside_office_rate),
        dhaka_home_rate: Number(body.dhaka_home_rate),
        outside_home_rate: Number(body.outside_home_rate),
      }
    });
    return NextResponse.json({ success: true, config });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create config" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { id, ...updateData } = body;
    if (!id) return NextResponse.json({ error: "ID missing" }, { status: 400 });

    const config = await prisma.shipping_configs.update({
      where: { id: Number(id) },
      data: {
        courier_name: updateData.courier_name,
        category_id: updateData.category_id ? Number(updateData.category_id) : null,
        is_weight_based: updateData.is_weight_based === true || updateData.is_weight_based === 'true',
        dhaka_office_rate: Number(updateData.dhaka_office_rate),
        outside_office_rate: Number(updateData.outside_office_rate),
        dhaka_home_rate: Number(updateData.dhaka_home_rate),
        outside_home_rate: Number(updateData.outside_home_rate),
      }
    });
    return NextResponse.json({ success: true, config });
  } catch (err) {
    return NextResponse.json({ error: "Failed to update config" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "ID missing" }, { status: 400 });

  try {
    await prisma.shipping_configs.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete config" }, { status: 500 });
  }
}
