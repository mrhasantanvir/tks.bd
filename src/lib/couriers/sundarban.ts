import { CourierBookingRequest, CourierBookingResponse, CourierHandler } from "./types";

export class SundarbanHandler implements CourierHandler {
  // Sundarban Merchant API (SCS Digital)
  private baseUrl = "https://sundarbancourierltd.com/api/v1"; 

  async bookOrder(req: CourierBookingRequest, config: any): Promise<CourierBookingResponse> {
    const { api_key, secret_key } = config;

    if (!api_key || !secret_key) {
      return { success: false, error: "Sundarban API Credentials Missing" };
    }

    try {
      const response = await fetch(`${this.baseUrl}/create-parcel`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${api_key}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          sender_name: "TKS.bd Agro",
          recipient_name: req.recipient_name,
          recipient_phone: req.recipient_phone,
          recipient_address: req.recipient_address,
          cod_amount: req.cod_amount,
          invoice_number: req.invoice_id,
          weight: req.weight,
        }),
      });

      const data = await response.json();

      if (data.status === "success") {
        return {
          success: true,
          tracking_number: data.tracking_id || data.consignment_id,
          raw_response: data,
        };
      }

      return { success: false, error: data.message || "Sundarban Booking Failed", raw_response: data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async trackOrder(trackingNumber: string, config: any): Promise<any> {
    const { api_key } = config;
    try {
      const response = await fetch(`${this.baseUrl}/track-parcel/${trackingNumber}`, {
        headers: { "Authorization": `Bearer ${api_key}` },
      });
      return await response.json();
    } catch (error) {
      return { status: "error", message: "Tracking failed" };
    }
  }
}
