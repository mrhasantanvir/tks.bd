"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";

interface Lot {
  id: number;
  name: string;
  size: number;
  packaging_charge: number;
}

interface ProductPurchaseCardProps {
  product: {
    id: number;
    name: string;
    price_per_unit: any;
    regular_price?: any;
    available_stock: any;
    harvest_date: Date | null;
    is_preorder: boolean | null;
    image_url: string | null;
    lot_size?: any;
    packaging_charge?: any;
    unit?: { name: string };
    category?: { name: string };
    allow_home_delivery?: boolean;
    allow_point_delivery?: boolean;
    available_couriers?: string;
    payment_policy?: string;
    partial_advance_val?: any;
  };
  lots: Lot[];
}

export default function ProductPurchaseCard({ product, lots }: ProductPurchaseCardProps) {
  const { addToCart } = useCart();
  
  // State for selections
  const [selectedLot, setSelectedLot] = useState<Lot | null>(
    lots.length > 0 ? lots[0] : { id: 0, name: 'Standard', size: Number(product.lot_size || 1), packaging_charge: Number(product.packaging_charge || 0) }
  );
  const [quantity, setQuantity] = useState(1);

  const pricePerUnit = Number(product.price_per_unit);
  const regularPrice = Number(product.regular_price || 0);
  const isMango = product.category?.name?.toLowerCase().includes('mango') || product.name?.toLowerCase().includes('mango') || product.name?.includes('আম');

  const currentLotSize = selectedLot?.size || Number(product.lot_size || 1);
  const currentPkgCharge = selectedLot?.packaging_charge || Number(product.packaging_charge || 0);

  const totalWeight = currentLotSize * quantity;
  const totalProductPrice = pricePerUnit * totalWeight;
  const totalPackagingPrice = currentPkgCharge * quantity;
  const totalPrice = totalProductPrice + totalPackagingPrice;

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price_per_unit: pricePerUnit,
      unit_type: product.unit?.name || 'kg',
      lotSize: currentLotSize,
      quantity,
      packaging_charge: currentPkgCharge,
      harvest_date: product.harvest_date ? product.harvest_date.toString() : null,
      image_url: product.image_url,
      allow_home_delivery: product.allow_home_delivery ?? true,
      allow_point_delivery: product.allow_point_delivery ?? true,
      available_couriers: JSON.parse(product.available_couriers || '["Steadfast", "Sundarban"]'),
      payment_policy: product.payment_policy || 'cod',
      partial_advance_val: product.partial_advance_val ? Number(product.partial_advance_val) : null,
    });
    alert(`Added ${totalWeight} ${product.unit?.name || 'KG'} of ${product.name} to your cart!`);
  };

  return (
    <div className="p-8 bg-white rounded-[2.5rem] border border-stone-100 shadow-[0_20px_50px_rgba(0,0,0,0.04)] flex flex-col gap-8 animate-fade-in">
      <div className="flex justify-between items-start border-b border-stone-50 pb-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
             <span className="text-4xl font-display font-black text-primary">
               ৳{totalPrice.toLocaleString()}
             </span>
             {regularPrice > pricePerUnit && (
                <span className="text-lg font-bold text-stone-300 line-through mt-2">
                   ৳{(regularPrice * currentLotSize * quantity).toLocaleString()}
                </span>
             )}
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-emerald-600 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
              ৳{pricePerUnit.toLocaleString()} / {product.unit?.name || 'KG'}
            </span>
            {currentPkgCharge > 0 && (
              <span className="text-amber-600 text-[9px] font-bold uppercase tracking-widest flex items-center gap-2">
                <span className="material-symbols-outlined text-[12px]">package_2</span>
                + ৳{currentPkgCharge.toLocaleString()} Packaging per Lot
              </span>
            )}
          </div>
        </div>
        {regularPrice > pricePerUnit && (
           <div className="px-3 py-1 bg-red-50 text-red-500 text-[9px] font-black uppercase tracking-widest rounded-lg border border-red-100">
              Save ৳{((regularPrice - pricePerUnit) * totalWeight).toLocaleString()}
           </div>
        )}
      </div>

      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] ml-1">
               {isMango ? 'Available Lots (প্যাকেজ)' : 'Unit Configuration'}
            </label>
            {lots.length > 0 ? (
               <select 
                  value={selectedLot?.id} 
                  onChange={(e) => setSelectedLot(lots.find(l => l.id == Number(e.target.value)) || null)}
                  className="w-full px-5 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-[11px] font-black text-primary outline-none focus:border-accent appearance-none transition-all shadow-inner"
               >
                  {lots.map(lot => (
                    <option key={lot.id} value={lot.id}>{lot.name} ({lot.size} {product.unit?.name || 'KG'})</option>
                  ))}
               </select>
            ) : (
               <div className="px-5 py-4 bg-stone-50 border border-stone-100 rounded-2xl text-[11px] font-black text-primary shadow-inner">
                  {currentLotSize} {product.unit?.name || 'KG'} Standard Pack
               </div>
            )}
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] ml-1">Number of Lots</label>
            <div className="flex items-center bg-stone-50 border border-stone-100 rounded-2xl overflow-hidden shadow-inner">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-14 h-14 hover:bg-stone-100 transition-colors flex items-center justify-center text-primary font-black text-lg"
              >
                -
              </button>
              <input 
                type="number" 
                value={quantity}
                readOnly
                className="w-full text-center bg-transparent outline-none font-black text-primary" 
              />
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-14 h-14 hover:bg-stone-100 transition-colors flex items-center justify-center text-primary font-black text-lg"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 bg-primary rounded-3xl flex items-center justify-between shadow-2xl shadow-primary/20 relative overflow-hidden group">
           <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-[0.03] transition-opacity"></div>
           <div>
              <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] mb-1">Total Shipping Weight</p>
              <span className="text-3xl font-display font-black text-white">{totalWeight} {product.unit?.name || 'KG'}</span>
           </div>
           <span className="material-symbols-outlined text-4xl text-accent opacity-40 group-hover:scale-110 transition-transform">scale</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <div className="p-5 bg-stone-50 rounded-2xl border border-stone-100 flex items-start gap-3">
            <span className="material-symbols-outlined text-emerald-500">eco</span>
            <div>
               <p className="text-[9px] font-black text-primary uppercase tracking-widest mb-1">Purity Grade</p>
               <p className="text-[10px] font-bold text-stone-500 leading-tight">100% Chemical-Free Organic Harvest</p>
            </div>
         </div>
         <div className="p-5 bg-stone-50 rounded-2xl border border-stone-100 flex items-start gap-3">
            <span className="material-symbols-outlined text-amber-500">local_shipping</span>
            <div>
               <p className="text-[9px] font-black text-primary uppercase tracking-widest mb-1">Fulfillment</p>
               <p className="text-[10px] font-bold text-stone-500 leading-tight">Secure Boxed Packaging via Partners</p>
            </div>
         </div>
      </div>

      <button 
        onClick={handleAddToCart}
        className={`w-full py-6 text-white font-black text-[11px] uppercase tracking-[0.3em] rounded-3xl transition-all shadow-2xl active:scale-[0.98] flex items-center justify-center gap-4 hover:translate-y-[-2px] ${product.is_preorder ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-200' : 'bg-primary hover:bg-primary-light shadow-primary/20'}`}
      >
        {product.is_preorder ? 'Initiate Pre-order' : 'Add to Fresh Cart'}
        <span className="material-symbols-outlined text-lg">{product.is_preorder ? 'lock_clock' : 'shopping_basket'}</span>
      </button>
      
      <div className="flex flex-col items-center gap-2">
         <p className="text-[9px] font-black text-stone-300 uppercase tracking-[0.3em]">
           {Number(product.available_stock) < 50 ? `Limited Stock Alert: ${Number(product.available_stock)} units left` : "Secure Checkout • Encrypted Access"}
         </p>
         {product.payment_policy === 'partial_advance' && (
            <p className="text-[8px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
               Booking: ৳{product.partial_advance_val} Advance Required
            </p>
         )}
      </div>
    </div>
  );
}
