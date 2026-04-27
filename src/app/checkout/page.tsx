"use client";

import { useCart } from "@/context/CartContext";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function CheckoutPage() {
  const { cart, totalAmount } = useCart();
  const [districts, setDistricts] = useState<any[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<any>(null);
  const [deliveryType, setDeliveryType] = useState<"home" | "point">("home");
   const [packageCouriers, setPackageCouriers] = useState<Record<string, string>>({});
   const [shippingSettings, setShippingSettings] = useState<Record<string, string>>({});
   const [shippingConfigs, setShippingConfigs] = useState<any[]>([]);
   const [allCouriers, setAllCouriers] = useState<any[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [addressId, setAddressId] = useState<number | null>(null);
    const [fullAddress, setFullAddress] = useState("");

   useEffect(() => {
     const fetchSettings = async () => {
       const res = await fetch("/api/settings");
       if (res.ok) {
         const data = await res.json();
         setShippingSettings(data.settings);
         setShippingConfigs(data.shipping_configs || []);
       }
     };
     const fetchCouriers = async () => {
       const res = await fetch("/api/couriers");
       if (res.ok) {
         const data = await res.json();
         setAllCouriers(data.couriers || []);
       }
     };
     fetchSettings();
     fetchCouriers();
   }, []);

  // Group items by harvest date
  const packages = cart.reduce((acc: any, item) => {
    const date = item.harvest_date || "Early June";
    if (!acc[date]) acc[date] = [];
    acc[date].push(item);
    return acc;
  }, {});

  useEffect(() => {
    setDistricts([
      { id: 1, name: "Dhaka", is_dhaka: true },
      { id: 2, name: "Rajshahi", is_dhaka: false },
      { id: 3, name: "Chittagong", is_dhaka: false },
      { id: 4, name: "Sylhet", is_dhaka: false },
    ]);
  }, []);

  const calculatePackageShipping = (pkgItems: any[], pkgDate: string) => {
    if (!selectedDistrict) return 0;
    
    const courier = packageCouriers[`pkg-${pkgDate}`];
    let totalWeightCharge = 0;
    let maxFixedCharge = 0;

    pkgItems.forEach(item => {
      // Find matching config
      const config = shippingConfigs.find(c => 
        (c.courier_name === courier || !courier) && 
        (c.category_id === item.category_id || !c.category_id)
      );

      if (config) {
        let rate = 0;
        if (selectedDistrict.is_dhaka) {
          rate = deliveryType === "home" ? Number(config.dhaka_home_rate) : Number(config.dhaka_office_rate);
        } else {
          rate = deliveryType === "home" ? Number(config.outside_home_rate) : Number(config.outside_office_rate);
        }

        if (config.is_weight_based) {
          const weight = (item.lotSize || 1) * item.quantity;
          totalWeightCharge += (weight * rate);
        } else {
          maxFixedCharge = Math.max(maxFixedCharge, rate);
        }
      } else {
        // Fallback to legacy or 60 BDT if no config found
        maxFixedCharge = Math.max(maxFixedCharge, 60);
      }
    });

    return totalWeightCharge + maxFixedCharge;
  };

  const handleSubmit = async () => {
    if (!selectedDistrict || !fullAddress) {
      alert("Please select district and provide full address");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        body: JSON.stringify({
          items: cart,
          district_id: selectedDistrict.id,
          delivery_type: deliveryType,
          address_details: fullAddress,
          package_couriers: packageCouriers,
          payment_method: "bkash" // Defaulting for now
        })
      });

      if (res.ok) {
        const data = await res.json();
        window.location.href = `/order-success?id=${data.order_id}`;
      } else {
        const error = await res.json();
        alert(error.error || "Order placement failed");
      }
    } catch (err) {
      alert("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalShipping = Object.entries(packages).reduce((acc: number, [date, items]: [string, any]) => {
    return acc + calculatePackageShipping(items, date);
  }, 0);

  // Recalculate Subtotal with Packaging
  const subtotalWithPackaging = cart.reduce((acc, item) => {
    return acc + (item.price_per_unit * item.lotSize * item.quantity) + ((item.packaging_charge || 0) * item.quantity);
  }, 0);

  // Determine Payment Policy (most strict wins)
  let paymentRequired = subtotalWithPackaging + totalShipping;
  let paymentNote = "Full amount at checkout";
  
  const hasFullAdvance = cart.some(item => item.payment_policy === 'full_advance');
  const partialAdvances = cart.filter(item => item.payment_policy === 'partial_advance');

  if (hasFullAdvance) {
    paymentRequired = subtotalWithPackaging + totalShipping;
    paymentNote = "Full payment required for these items";
  } else if (partialAdvances.length > 0) {
    const advanceTotal = partialAdvances.reduce((acc, item) => acc + (item.partial_advance_val || 0), 0);
    paymentRequired = advanceTotal + totalShipping;
    paymentNote = `৳${advanceTotal} Advance + Shipping required. Rest on Delivery.`;
  } else {
    paymentRequired = totalShipping;
    paymentNote = "Only shipping charge as advance. Rest on Delivery (COD).";
  }

  return (
    <div className="min-h-screen bg-stone-50 pt-24 pb-24 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7 space-y-8">
          <div className="bg-white p-10 rounded-2xl border border-stone-100 shadow-sm">
            <h2 className="text-2xl font-display font-bold text-primary mb-8 flex items-center gap-3">
              <span className="material-symbols-outlined">local_shipping</span>
              Shipping Information
            </h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-widest">District</label>
                  <select 
                    onChange={(e) => setSelectedDistrict(districts.find(d => d.id === parseInt(e.target.value)))}
                    className="w-full px-4 py-4 bg-stone-50 border border-stone-100 rounded-lg outline-none focus:border-primary transition-all text-xs font-bold"
                  >
                    <option value="">Select District</option>
                    {districts.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-widest">Delivery Type</label>
                  <div className="flex bg-stone-50 p-1 rounded-lg border border-stone-100">
                    <button onClick={() => setDeliveryType("home")} className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest rounded-md transition-all ${deliveryType === "home" ? "bg-primary text-white shadow-md" : "text-stone-400"}`}>Home</button>
                    <button onClick={() => setDeliveryType("point")} className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest rounded-md transition-all ${deliveryType === "point" ? "bg-primary text-white shadow-md" : "text-stone-400"}`}>Point</button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-primary uppercase tracking-widest">Full Address</label>
                <textarea 
                  rows={3} 
                  value={fullAddress}
                  onChange={(e) => setFullAddress(e.target.value)}
                  placeholder="House no, Street, Area..." 
                  className="w-full px-4 py-4 bg-stone-50 border border-stone-100 rounded-lg outline-none focus:border-primary transition-all text-sm font-medium"
                ></textarea>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-sm font-bold text-stone-400 uppercase tracking-[0.2em] px-2">Shipment Breakdown</h3>
            {Object.entries(packages).map(([date, items]: [string, any], index) => {
              const packageKey = `pkg-${date}`;
              const availableCouriers = items[0].available_couriers || []; // Assuming items in same harvest have same couriers
              
              return (
                <div key={date} className="bg-white p-8 rounded-2xl border-l-8 border-primary shadow-sm space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-display font-bold text-xl text-primary flex items-center gap-2">
                        Package {String.fromCharCode(65 + index)} 
                        <span className="text-[10px] font-bold text-stone-400 bg-stone-100 px-3 py-1 rounded-full">Harvest: {date}</span>
                      </h4>
                      <p className="text-[9px] text-stone-400 font-bold uppercase tracking-widest mt-2">Shipping Cost: ৳{calculatePackageShipping(items, date)}</p>
                    </div>
                    
                    <div className="w-48 space-y-2">
                      <label className="text-[8px] font-black text-stone-400 uppercase tracking-widest">Select Courier</label>
                      <select 
                        value={packageCouriers[packageKey] || ""}
                        onChange={(e) => setPackageCouriers(prev => ({...prev, [packageKey]: e.target.value}))}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-100 rounded-lg text-[10px] font-bold outline-none focus:border-primary"
                      >
                        <option value="">Preferred Courier</option>
                        {allCouriers.filter(c => c.is_active && pkgItems[0].product.available_couriers?.includes(c.name)).map((c: any) => (
                          <option key={c.id} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="divide-y divide-stone-50">
                    {items.map((item: any) => {
                      const itemProductPrice = item.price_per_unit * item.lotSize * item.quantity;
                      const itemPackagingPrice = (item.packaging_charge || 0) * item.quantity;
                      const itemTotal = itemProductPrice + itemPackagingPrice;

                      return (
                        <div key={item.id} className="py-4 flex justify-between items-center">
                          <div className="flex gap-4 items-center">
                            <div className="w-12 h-12 bg-stone-100 rounded-lg overflow-hidden border border-stone-100">
                              <img src={item.image_url || "/placeholder.jpg"} className="w-full h-full object-cover" alt="" />
                            </div>
                            <div>
                              <p className="font-black text-primary text-sm leading-tight">{item.name}</p>
                              <p className="text-[9px] text-stone-400 uppercase tracking-widest font-bold mt-1">
                                {item.lotSize} {item.unit_type} x {item.quantity}
                                {item.packaging_charge > 0 && <span className="ml-2 text-secondary">+ ৳{item.packaging_charge * item.quantity} Packaging</span>}
                              </p>
                            </div>
                          </div>
                          <p className="font-black text-primary text-sm">৳{itemTotal.toLocaleString()}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-5 h-fit sticky top-24">
          <div className="bg-primary text-white p-10 rounded-2xl shadow-2xl space-y-8">
            <h2 className="text-2xl font-display font-bold border-b border-white/10 pb-6 uppercase tracking-widest">Checkout Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between text-white/60 text-xs font-bold uppercase tracking-widest">
                <span>Subtotal (Items + Packaging)</span>
                <span className="font-bold text-white">৳{subtotalWithPackaging.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-white/60 text-xs font-bold uppercase tracking-widest">
                <span>Estimated Shipping</span>
                <span className="font-bold text-white">৳{totalShipping.toLocaleString()}</span>
              </div>
              <div className="pt-6 border-t border-white/10">
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-sm font-bold uppercase tracking-[0.2em] text-accent">Payable Now</span>
                  <span className="text-4xl font-display font-bold text-accent">৳{paymentRequired.toLocaleString()}</span>
                </div>
                <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest text-right italic">{paymentNote}</p>
              </div>
            </div>

            <button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`w-full py-6 bg-accent text-primary font-black text-[11px] uppercase tracking-[0.3em] rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-accent/20 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Processing...' : 'Confirm & Pay Advance'}
            </button>
            
            <div className="pt-4 flex items-center gap-2 text-[8px] font-bold text-white/20 uppercase tracking-[0.4em] justify-center">
              <span className="material-symbols-outlined text-[14px]">verified_user</span>
              End-to-End Encrypted Transaction
            </div>
          </div>
        </div>
      </div>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" />
    </div>
  );
}
