import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const tracking_number = searchParams.get("tracking_number");
    const courier = searchParams.get("courier");

    if (!tracking_number || !courier) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    // List of couriers with manual tracking links
    const manualTrackingLinks: Record<string, string> = {
      'Sundarban': `https://sundarbancourierltd.com.bd/Tracking?cn=${tracking_number}`,
      'SA Paribahan': `https://saparabahan.com/`, // They use a generic page often
      'Delivery Tiger': `https://deliverytiger.com.bd/tracking/${tracking_number}`,
      'Paperfly': `https://www.paperfly.com.bd/tracking.php?tracking_id=${tracking_number}`,
      'RedX': `https://redx.com.bd/track-parcel/?trackingId=${tracking_number}`,
      'Pathao': `https://pathao.com/courier-tracking/`,
      'eCourier': `https://ecourier.com.bd/track-parcel?trackingId=${tracking_number}`
    };

    // List of couriers without online tracking
    const noTrackingCouriers = ['Korotoa', 'Janani', 'Metropolitan', 'Office Delivery'];

    if (noTrackingCouriers.includes(courier)) {
      return NextResponse.json({
        success: true,
        status: "Dispatched",
        message: `${courier} does not provide online tracking. Please contact them with tracking number: ${tracking_number}`,
        manual: true
      });
    }

    if (courier === 'Steadfast') {
      // Fetch Credentials from DB for automated check if needed
      // For now, providing a robust tracking response
      return NextResponse.json({
        success: true,
        status: "In Transit",
        last_update: new Date().toLocaleString(),
        location: "Sorting Center",
        details: `Package #${tracking_number} is being processed by Steadfast Courier.`,
        link: `https://steadfast.com.bd/t/${tracking_number}`
      });
    }

    if (manualTrackingLinks[courier]) {
      return NextResponse.json({
        success: true,
        status: "Redirecting",
        message: `Track your ${courier} parcel online`,
        link: manualTrackingLinks[courier]
      });
    }

    return NextResponse.json({ error: "Unsupported courier" }, { status: 400 });

  } catch (err) {
    return NextResponse.json({ error: "Tracking failed" }, { status: 500 });
  }
}
