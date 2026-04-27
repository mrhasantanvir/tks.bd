import { CourierBookingRequest, CourierBookingResponse, CourierHandler } from "./types";

export class PathaoHandler implements CourierHandler {
  private baseUrl = "https://api-hermes.pathao.com";

  private async getAccessToken(config: any): Promise<string | null> {
    const { client_id, client_secret, username, password } = config;
    try {
      const res = await fetch(`${this.baseUrl}/aladdin/api/v1/issue-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ client_id, client_secret, username, password, grant_type: "password" })
      });
      const data = await res.json();
      return data.access_token || null;
    } catch { return null; }
  }

  async bookOrder(req: CourierBookingRequest, config: any): Promise<CourierBookingResponse> {
    const token = await this.getAccessToken(config);
    if (!token) return { success: false, error: "Pathao Token Issue" };

    try {
      const res = await fetch(`${this.baseUrl}/aladdin/api/v1/orders`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          store_id: config.store_id, // Pathao needs a store ID
          recipient_name: req.recipient_name,
          recipient_phone: req.recipient_phone,
          recipient_address: req.recipient_address,
          recipient_city: config.city_id || 1, // Fallback city
          recipient_zone: config.zone_id || 1,
          delivery_type: 48, // Normal
          item_type: 2, // Parcel
          order_type: 2, // Delivery
          item_quantity: 1,
          amount_to_collect: req.cod_amount,
          merchant_order_id: req.invoice_id,
          item_description: "Agro Products"
        })
      });
      const data = await res.json();
      if (data.type === "success") {
        return { success: true, tracking_number: data.data.consignment_id, raw_response: data };
      }
      return { success: false, error: data.message || "Pathao Booking Failed", raw_response: data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async trackOrder(trackingNumber: string, config: any): Promise<any> {
    // Pathao tracking logic
    return { status: "Feature coming soon" };
  }
}
