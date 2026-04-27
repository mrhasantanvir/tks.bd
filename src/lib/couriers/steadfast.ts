import { CourierBookingRequest, CourierBookingResponse, CourierHandler } from "./types";

export class SteadfastHandler implements CourierHandler {
  private baseUrl = "https://portal.steadfast.com.bd/api/v1";

  async bookOrder(req: CourierBookingRequest, config: any): Promise<CourierBookingResponse> {
    const { api_key, secret_key } = config;

    if (!api_key || !secret_key) {
      return { success: false, error: "Steadfast API Key or Secret Missing" };
    }

    try {
      const response = await fetch(`${this.baseUrl}/create_order`, {
        method: "POST",
        headers: {
          "Api-Key": api_key,
          "Secret-Key": secret_key,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          invoice: req.invoice_id,
          recipient_name: req.recipient_name,
          recipient_phone: req.recipient_phone,
          recipient_address: req.recipient_address,
          cod_amount: req.cod_amount,
          note: req.note || "TKS.bd Order",
        }),
      });

      const data = await response.json();

      if (data.status === 200) {
        return {
          success: true,
          tracking_number: data.order.consignment_id,
          raw_response: data,
        };
      }

      return { success: false, error: data.message || "Booking Failed", raw_response: data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async trackOrder(trackingNumber: string, config: any): Promise<any> {
    const { api_key, secret_key } = config;
    try {
      const response = await fetch(`${this.baseUrl}/track_order/${trackingNumber}`, {
        headers: {
          "Api-Key": api_key,
          "Secret-Key": secret_key,
        },
      });
      return await response.json();
    } catch (error) {
      return { status: "error", message: "Tracking failed" };
    }
  }
}
