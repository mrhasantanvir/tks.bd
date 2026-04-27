export async function sendSMS(to: string, message: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/admin/settings?keys=sms_gateway_url,sms_api_key,sms_sender_id,sms_is_active`);
    const { settings } = await res.json();
    const config = Object.fromEntries(settings.map((s: any) => [s.key, s.value]));

    if (config.sms_is_active !== 'true') return { success: false, error: "SMS Gateway Inactive" };

    const url = config.sms_gateway_url;
    const apiKey = config.sms_api_key;
    const senderId = config.sms_sender_id;

    if (!url || !apiKey) return { success: false, error: "SMS Configuration Missing" };

    // Common BD SMS Gateway pattern: URL?api_key=...&number=...&message=...&senderid=...
    // We will support a flexible placeholder system in the URL or default to query params
    
    let finalUrl = url
      .replace("{api_key}", apiKey)
      .replace("{to}", to)
      .replace("{message}", encodeURIComponent(message))
      .replace("{sender_id}", senderId || "");

    // If placeholders aren't used, append as standard query params
    if (!url.includes("{to}")) {
      const separator = url.includes("?") ? "&" : "?";
      finalUrl = `${url}${separator}api_key=${apiKey}&number=${to}&message=${encodeURIComponent(message)}&senderid=${senderId || ""}`;
    }

    const smsRes = await fetch(finalUrl);
    const result = await smsRes.text();

    return { success: true, result };
  } catch (error: any) {
    console.error("SMS Sending Failed:", error);
    return { success: false, error: error.message };
  }
}

export async function sendTemplateSMS(type: 'order_confirm' | 'order_shipped' | 'admin_alert', data: any) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/admin/settings?keys=sms_template_${type},sms_admin_number,site_phone`);
    const { settings } = await res.json();
    const config = Object.fromEntries(settings.map((s: any) => [s.key, s.value]));

    let template = config[`sms_template_${type}`];
    if (!template) {
      // Default Templates
      const defaults = {
        order_confirm: "ধন্যবাদ! আপনার অর্ডার #{order_id} সফলভাবে গ্রহণ করা হয়েছে। মোট বিল: ৳{amount}। - TKS.bd",
        order_shipped: "সুসংবাদ! আপনার অর্ডার #{order_id} কুরিয়ারে পাঠানো হয়েছে। ট্র্যাকিং নং: {tracking}। - TKS.bd",
        admin_alert: "নতুন অর্ডার এলার্ট! অর্ডার #{order_id}। কাস্টমার: {name}, মোবাইল: {mobile}। - TKS.bd Admin"
      };
      template = defaults[type];
    }

    // Replace Placeholders
    const message = template
      .replace("{order_id}", data.order_id || "")
      .replace("{amount}", data.amount || "")
      .replace("{tracking}", data.tracking || "")
      .replace("{name}", data.name || "")
      .replace("{mobile}", data.mobile || "");

    const targetNumber = type === 'admin_alert' ? (config.sms_admin_number || config.site_phone || '01700000000') : data.to;
    
    return await sendSMS(targetNumber, message);
  } catch (err) {
    console.error("Template SMS Failed:", err);
    return { success: false };
  }
}
