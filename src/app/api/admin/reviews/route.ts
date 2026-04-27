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

export async function GET() {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const reviews = await prisma.reviews.findMany({
      orderBy: { created_at: 'desc' }
    });
    return NextResponse.json({ reviews });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const review = await prisma.reviews.create({
      data: {
        user_name: body.user_name,
        comment: body.comment,
        rating: Number(body.rating),
        image_url: body.image_url,
        is_visible: true
      }
    });
    return NextResponse.json({ success: true, review });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { id, ...updateData } = body;
    if (!id) return NextResponse.json({ error: "ID missing" }, { status: 400 });

    const review = await prisma.reviews.update({
      where: { id: Number(id) },
      data: {
        user_name: updateData.user_name,
        comment: updateData.comment,
        rating: Number(updateData.rating),
        image_url: updateData.image_url,
      }
    });
    return NextResponse.json({ success: true, review });
  } catch (err) {
    return NextResponse.json({ error: "Failed to update review" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "ID missing" }, { status: 400 });

  try {
    await prisma.reviews.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
  }
}
