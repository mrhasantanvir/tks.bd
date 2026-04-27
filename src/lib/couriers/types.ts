export interface CourierBookingRequest {
  invoice_id: string;
  recipient_name: string;
  recipient_phone: string;
  recipient_address: string;
  cod_amount: number;
  weight: number;
  note?: string;
}

export interface CourierBookingResponse {
  success: boolean;
  tracking_number?: string;
  error?: string;
  raw_response?: any;
}

export interface CourierHandler {
  bookOrder(req: CourierBookingRequest, config: any): Promise<CourierBookingResponse>;
  trackOrder(trackingNumber: string, config: any): Promise<any>;
}
