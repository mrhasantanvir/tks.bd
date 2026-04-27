import { CourierBookingRequest, CourierBookingResponse, CourierHandler } from "./types";

export class RedXHandler implements CourierHandler {
  private baseUrl = "https://api.redx.com.bd/v1.0.0";

  async bookOrder(req: CourierBookingRequest, config: any): Promise<CourierBookingResponse> {
    const { api_token } = config;
    if (!api_token) return { success: false, error: "RedX API Token Missing" };

    try {
      const res = await fetch(`${this.baseUrl}/parcels`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${api_token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          customer_name: req.recipient_name,
          customer_phone: req.recipient_phone,
          customer_address: req.recipient_address,
          destination_details: req.recipient_address,
          cash_to_collect: req.cod_amount,
          parcel_weight: req.weight,
          instruction: "Fragile - Agro Product",
          value: req.cod_amount,
          merchant_id: config.merchant_id
        })
      });
      const data = await res.json();
      if (data.tracking_id) {
        return { success: true, tracking_number: data.tracking_id, raw_response: data };
      }
      return { success: false, error: data.message || "RedX Booking Failed", raw_response: data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async trackOrder(trackingNumber: string, config: any): Promise<any> {
    return { status: "Feature coming soon" };
  }
}
