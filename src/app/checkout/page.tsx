"use client";

import { useCart } from "@/context/CartContext";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { cart, totalAmount } = useCart();
  const router = useRouter();

  const [districts, setDistricts] = useState<any[]>([]);
  const [upazilas, setUpazilas] = useState<any[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<any>(null);
  const [selectedUpazilaId, setSelectedUpazilaId] = useState<string>("");
  const [deliveryType, setDeliveryType] = useState<"home" | "point">("home");
  
  const [customerName, setCustomerName] = useState("");
  const [customerMobile, setCustomerMobile] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [otp, setOtp] = useState("");
  
  const [step, setStep] = useState(1); // 1: Info, 2: OTP
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOtpSending, setIsOtpSending] = useState(false);
  
  const [allCouriers, setAllCouriers] = useState<any[]>([]);
  const [shippingConfigs, setShippingConfigs] = useState<any[]>([]);
  const [packageCouriers, setPackageCouriers] = useState<Record<string, string>>({});
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const init = async () => {
      // Fetch Districts
      const dRes = await fetch("/api/districts");
      if (dRes.ok) setDistricts((await dRes.json()).districts || []);

      // Fetch User (if already logged in)
      const uRes = await fetch("/api/user/profile");
      if (uRes.ok) {
        const data = await uRes.json();
        setUser(data.user);
        setCustomerName(data.user.full_name || "");
        setCustomerMobile(data.user.mobile_number || "");
      }

      // Fetch Settings & Couriers
      const sRes = await fetch("/api/settings");
      if (sRes.ok) {
        const data = await sRes.json();
        setShippingConfigs(data.shipping_configs || []);
      }
      const cRes = await fetch("/api/couriers");
      if (cRes.ok) setAllCouriers((await cRes.json()).couriers || []);
    };
    init();
  }, []);

  useEffect(() => {
    if (selectedDistrict) {
      fetch(`/api/districts/${selectedDistrict.id}/upazilas`)
        .then(res => res.json())
        .then(data => setUpazilas(data.upazilas || []));
    } else {
      setUpazilas([]);
    }
  }, [selectedDistrict]);

  const packages = cart.reduce((acc: any, item) => {
    const date = item.harvest_date || "Seasonal Harvest";
    if (!acc[date]) acc[date] = [];
    acc[date].push(item);
    return acc;
  }, {});

  const calculatePackageShipping = (pkgItems: any[], pkgDate: string) => {
    if (!selectedDistrict) return 0;
    const courier = packageCouriers[`pkg-${pkgDate}`];
    let totalWeightCharge = 0;
    let maxFixedCharge = 0;

    pkgItems.forEach(item => {
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
        maxFixedCharge = Math.max(maxFixedCharge, 60);
      }
    });

    return totalWeightCharge + maxFixedCharge;
  };

  const totalShipping = Object.entries(packages).reduce((acc: number, [date, items]: [string, any]) => {
    return acc + calculatePackageShipping(items, date);
  }, 0);

  const subtotalWithPackaging = cart.reduce((acc, item) => {
    return acc + (item.price_per_unit * item.lotSize * item.quantity) + ((item.packaging_charge || 0) * item.quantity);
  }, 0);

  const handleSendOtp = async () => {
    if (!customerMobile || customerMobile.length < 11) return alert("Valid Mobile Number required");
    if (!customerName || !selectedDistrict || !selectedUpazilaId || !fullAddress) return alert("Fill all information first");
    
    setIsOtpSending(true);
    try {
      const res = await fetch("/api/auth/otp", {
        method: "POST",
        body: JSON.stringify({ mobile: customerMobile })
      });
      const data = await res.json();
      if (res.ok) {
        setStep(2);
        alert(`Verification Code Sent! (Demo: ${data.demo_otp})`);
      } else alert(data.error);
    } catch (e) { alert("Failed to send OTP"); }
    finally { setIsOtpSending(false); }
  };

  const handleConfirmOrder = async () => {
    setIsSubmitting(true);
    try {
      // 1. Verify OTP first (if not already logged in)
      if (!user) {
        const vRes = await fetch("/api/auth/verify", {
          method: "POST",
          body: JSON.stringify({ mobile: customerMobile, otp })
        });
        if (!vRes.ok) {
          const error = await vRes.json();
          alert(error.error || "OTP Verification Failed");
          setIsSubmitting(false);
          return;
        }
        // Update user's name if it was empty
        await fetch("/api/user/profile", {
          method: "PUT",
          body: JSON.stringify({ full_name: customerName })
        });
      }

      // 2. Place Order
      const res = await fetch("/api/checkout", {
        method: "POST",
        body: JSON.stringify({
          items: cart,
          district_id: selectedDistrict.id,
          upazila_id: parseInt(selectedUpazilaId),
          delivery_type: deliveryType,
          address_details: fullAddress,
          package_couriers: packageCouriers,
          payment_method: "bkash" 
        })
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/order-success?id=${data.order_id}`);
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

  if (cart.length === 0) return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50">
       <div className="text-center space-y-6">
          <span className="material-symbols-outlined text-6xl text-stone-200">shopping_basket</span>
          <h2 className="text-2xl font-display font-bold text-primary">Your basket is empty</h2>
          <Link href="/" className="inline-block px-8 py-4 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-full">Start Shopping</Link>
       </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50 pt-32 pb-24 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7 space-y-8">
          
          <div className="bg-white p-8 md:p-12 rounded-[3rem] border border-stone-100 shadow-sm space-y-10">
            <h2 className="text-2xl font-display font-black text-primary uppercase tracking-tight flex items-center gap-4">
              <span className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center">
                <span className="material-symbols-outlined">person_pin_circle</span>
              </span>
              Shipping & Account
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-3">
                  <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1">Full Name</label>
                  <input 
                    value={customerName} 
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Recipient's Name" 
                    className="w-full px-6 py-5 bg-stone-50 border border-stone-100 rounded-2xl outline-none focus:border-primary transition-all text-xs font-bold" 
                  />
               </div>
               <div className="space-y-3">
                  <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1">Mobile Number</label>
                  <input 
                    value={customerMobile} 
                    onChange={(e) => setCustomerMobile(e.target.value)}
                    disabled={!!user}
                    placeholder="017XXXXXXXX" 
                    className="w-full px-6 py-5 bg-stone-50 border border-stone-100 rounded-2xl outline-none focus:border-primary transition-all text-xs font-bold disabled:opacity-50" 
                  />
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-3">
                  <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1">District</label>
                  <select 
                    onChange={(e) => setSelectedDistrict(districts.find(d => d.id === parseInt(e.target.value)))}
                    className="w-full px-6 py-5 bg-stone-50 border border-stone-100 rounded-2xl outline-none focus:border-primary transition-all text-xs font-bold appearance-none"
                  >
                    <option value="">Select District</option>
                    {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
               </div>
               <div className="space-y-3">
                  <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1">Upazila / Area</label>
                  <select 
                    value={selectedUpazilaId}
                    onChange={(e) => setSelectedUpazilaId(e.target.value)}
                    className="w-full px-6 py-5 bg-stone-50 border border-stone-100 rounded-2xl outline-none focus:border-primary transition-all text-xs font-bold appearance-none"
                  >
                    <option value="">Select Upazila</option>
                    {upazilas.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                  </select>
               </div>
            </div>

            <div className="space-y-3">
               <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1">Detailed Address</label>
               <textarea 
                  rows={3} 
                  value={fullAddress}
                  onChange={(e) => setFullAddress(e.target.value)}
                  placeholder="House #, Road #, Village..." 
                  className="w-full px-6 py-5 bg-stone-50 border border-stone-100 rounded-2xl outline-none focus:border-primary transition-all text-sm font-medium"
               ></textarea>
            </div>

            <div className="space-y-3">
               <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1">Delivery Method</label>
               <div className="flex bg-stone-50 p-2 rounded-[1.5rem] border border-stone-100 gap-2">
                  <button onClick={() => setDeliveryType("home")} className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${deliveryType === "home" ? "bg-primary text-white shadow-lg" : "text-stone-400 hover:text-primary"}`}>Home Delivery</button>
                  <button onClick={() => setDeliveryType("point")} className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${deliveryType === "point" ? "bg-primary text-white shadow-lg" : "text-stone-400 hover:text-primary"}`}>Courier Point</button>
               </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em] px-6">Your Consignments</h3>
            {Object.entries(packages).map(([date, items]: [string, any], index) => {
              const packageKey = `pkg-${date}`;
              const availableInProduct = items[0].available_couriers ? JSON.parse(items[0].available_couriers) : [];
              
              return (
                <div key={date} className="bg-white p-8 md:p-10 rounded-[2.5rem] border-l-[12px] border-primary shadow-sm space-y-8 overflow-hidden">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                    <div>
                      <h4 className="font-display font-black text-2xl text-primary leading-none">
                        Package {String.fromCharCode(65 + index)} 
                      </h4>
                      <p className="text-[9px] text-stone-400 font-bold uppercase tracking-[0.2em] mt-3 bg-stone-50 w-fit px-3 py-1 rounded-full">Harvest Schedule: {date}</p>
                    </div>
                    
                    <div className="w-full md:w-56 space-y-3">
                      <label className="text-[8px] font-black text-stone-400 uppercase tracking-widest ml-1">Select Courier</label>
                      <select 
                        value={packageCouriers[packageKey] || ""}
                        onChange={(e) => setPackageCouriers(prev => ({...prev, [packageKey]: e.target.value}))}
                        className="w-full px-5 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-[10px] font-bold outline-none focus:border-primary appearance-none"
                      >
                        <option value="">Choose Logistics Partner</option>
                        {allCouriers.filter(c => c.is_active && availableInProduct.includes(c.name)).map((c: any) => (
                          <option key={c.id} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="divide-y divide-stone-50">
                    {items.map((item: any) => (
                      <div key={item.id} className="py-6 flex justify-between items-center group">
                        <div className="flex gap-5 items-center">
                          <div className="w-16 h-16 bg-stone-50 rounded-2xl overflow-hidden border border-stone-100">
                            <img src={item.image_url || "/placeholder.jpg"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                          </div>
                          <div>
                            <p className="font-black text-primary text-sm leading-tight uppercase tracking-tight">{item.name}</p>
                            <p className="text-[9px] text-stone-400 uppercase tracking-widest font-bold mt-1.5">
                              {item.lotSize} {item.unit_type} x {item.quantity} Unit
                              {item.packaging_charge > 0 && <span className="ml-3 text-secondary">+ ৳{item.packaging_charge * item.quantity} Packaging</span>}
                            </p>
                          </div>
                        </div>
                        <p className="font-black text-primary text-base">৳{((item.price_per_unit * item.lotSize * item.quantity) + (item.packaging_charge || 0) * item.quantity).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-5 h-fit sticky top-32">
          <div className="bg-primary text-white p-10 md:p-12 rounded-[3.5rem] shadow-2xl space-y-10 relative overflow-hidden">
            {/* Background Spark */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 blur-[80px] -mr-32 -mt-32 rounded-full"></div>
            
            <h2 className="text-2xl font-display font-black border-b border-white/10 pb-8 uppercase tracking-[0.1em] relative z-10">Order Finalization</h2>
            
            <div className="space-y-6 relative z-10">
              <div className="flex justify-between text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">
                <span>Basket Subtotal</span>
                <span className="text-white">৳{subtotalWithPackaging.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">
                <span>Logistics Quote</span>
                <span className="text-white">৳{totalShipping.toLocaleString()}</span>
              </div>
              <div className="pt-8 border-t border-white/10">
                <div className="flex justify-between items-baseline mb-3">
                  <span className="text-xs font-black uppercase tracking-[0.3em] text-accent">Total Payable</span>
                  <span className="text-5xl font-display font-black text-accent tracking-tighter">৳{(subtotalWithPackaging + totalShipping).toLocaleString()}</span>
                </div>
                <p className="text-[9px] text-white/30 font-bold uppercase tracking-widest text-right italic leading-relaxed">Secured via Nagad / bKash / Rocket Gateway</p>
              </div>
            </div>

            {step === 1 ? (
               <button 
                  onClick={handleSendOtp}
                  disabled={isOtpSending}
                  className="w-full py-6 bg-accent text-primary font-black text-xs uppercase tracking-[0.3em] rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-accent/20 relative z-10"
               >
                  {isOtpSending ? 'Authenticating...' : 'Confirm Information'}
               </button>
            ) : (
               <div className="space-y-6 relative z-10 animate-fade-in">
                  <div className="space-y-3">
                     <label className="text-[9px] font-black text-accent uppercase tracking-widest ml-1">Verification Code (OTP)</label>
                     <input 
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="ENTER 6-DIGIT CODE" 
                        className="w-full px-6 py-5 bg-white/10 border border-white/20 rounded-2xl outline-none focus:border-accent transition-all text-center text-2xl font-display font-bold tracking-[0.5em] text-white" 
                     />
                  </div>
                  <button 
                     onClick={handleConfirmOrder}
                     disabled={isSubmitting}
                     className="w-full py-6 bg-accent text-primary font-black text-xs uppercase tracking-[0.3em] rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-accent/20"
                  >
                     {isSubmitting ? 'Finalizing Order...' : 'Verify & Place Order'}
                  </button>
                  <button onClick={() => setStep(1)} className="w-full text-[9px] text-white/40 font-black uppercase tracking-widest hover:text-white transition-colors">Edit Information</button>
               </div>
            )}
            
            <div className="pt-6 flex items-center gap-3 text-[8px] font-black text-white/20 uppercase tracking-[0.4em] justify-center relative z-10">
              <span className="material-symbols-outlined text-lg">shield_with_heart</span>
              Safe & Direct from Orchard
            </div>
          </div>
        </div>
      </div>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" />
    </div>
  );
}
