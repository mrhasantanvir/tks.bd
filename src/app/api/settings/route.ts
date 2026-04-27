import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const shippingSettings = await prisma.settings.findMany({
      where: {
        key: {
          startsWith: 'steadfast_'
        }
      }
    });

    // Only expose non-sensitive keys (shipping charges)
    const publicSettings = shippingSettings.filter(s => 
      s.key.includes('_per_kg') || s.key.includes('_charge')
    ).reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);

    const configs = await prisma.shipping_configs.findMany({
      include: { categories: { select: { id: true, slug: true, name: true } } }
    });

    return NextResponse.json({ settings: publicSettings, shipping_configs: configs });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}
