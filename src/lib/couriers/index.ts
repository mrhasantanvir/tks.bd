import { SteadfastHandler } from "./steadfast";
import { SundarbanHandler } from "./sundarban";
import { PathaoHandler } from "./pathao";
import { RedXHandler } from "./redx";
import { CourierBookingRequest, CourierBookingResponse, CourierHandler } from "./types";

const handlers: Record<string, CourierHandler> = {
  "Steadfast Logistics": new SteadfastHandler(),
  "Sundarban Courier": new SundarbanHandler(),
  "Pathao Courier": new PathaoHandler(),
  "RedX Delivery": new RedXHandler(),
};

export async function bookWithCourier(
  courierName: string, 
  request: CourierBookingRequest, 
  config: any
): Promise<CourierBookingResponse> {
  const handler = handlers[courierName];
  
  if (!handler) {
    return { 
      success: false, 
      error: `No automation handler for ${courierName}. Please process manually.` 
    };
  }

  return await handler.bookOrder(request, config);
}

export async function trackWithCourier(
  courierName: string,
  trackingNumber: string,
  config: any
): Promise<any> {
  const handler = handlers[courierName];
  if (!handler) return { status: "manual", message: "Manual courier" };
  return await handler.trackOrder(trackingNumber, config);
}
