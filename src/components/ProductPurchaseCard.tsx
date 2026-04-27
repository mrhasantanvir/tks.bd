"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";

interface ProductPurchaseCardProps {
  product: {
    id: number;
    name: string;
    price_per_unit: any;
    available_stock: any;
    harvest_date: Date | null;
    is_preorder: boolean | null;
    image_url: string | null;
  };
}

export default function ProductPurchaseCard({ product }: ProductPurchaseCardProps) {
  const [lotSize, setLotSize] = useState(Number(product.lot_size || 1));
  const [quantity, setQuantity] = useState(1);

  const packagingCharge = Number((product as any).packaging_charge || 0);
  const totalWeight = lotSize * quantity;
  const totalProductPrice = Number(product.price_per_unit) * totalWeight;
  const totalPackagingPrice = packagingCharge * quantity;
  const totalPrice = totalProductPrice + totalPackagingPrice;

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price_per_unit: Number(product.price_per_unit),
      unit_type: (product as any).unit?.name || 'kg',
      lotSize,
      quantity,
      packaging_charge: packagingCharge,
      harvest_date: product.harvest_date ? product.harvest_date.toString() : null,
      image_url: (product as any).image_url,
      allow_home_delivery: (product as any).allow_home_delivery ?? true,
      allow_point_delivery: (product as any).allow_point_delivery ?? true,
      available_couriers: JSON.parse((product as any).available_couriers || '["Steadfast", "Sundarban"]'),
      payment_policy: (product as any).payment_policy || 'cod',
      partial_advance_val: (product as any).partial_advance_val ? Number((product as any).partial_advance_val) : null,
    });
    alert(`Added ${totalWeight} ${(product as any).unit?.name || 'KG'} of ${product.name} to your cart!`);
  };

  return (
    <div className="p-8 bg-white rounded-2xl border border-stone-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] flex flex-col gap-8">
      <div className="flex justify-between items-baseline border-b border-stone-50 pb-6">
        <div className="flex flex-col">
          <span className="text-4xl font-display font-bold text-on-background">
            ৳{totalPrice.toLocaleString()}
            <span className="text-lg font-normal text-stone-400"> total</span>
          </span>
          <div className="flex flex-col gap-1 mt-2">
            <span className="text-primary text-[10px] font-bold uppercase tracking-widest">
              ৳{Number(product.price_per_unit).toLocaleString()} / {(product as any).unit?.name || 'KG'}
            </span>
            {packagingCharge > 0 && (
              <span className="text-secondary text-[9px] font-bold uppercase tracking-widest">
                + ৳{packagingCharge.toLocaleString()} Packaging per Lot
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-primary uppercase tracking-widest">Lot Details</label>
            <div className="px-4 py-4 bg-stone-50 border border-stone-100 rounded-lg text-xs font-bold text-stone-600">
              {lotSize} {(product as any).unit?.name || 'KG'} Pack
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-primary uppercase tracking-widest">No. of Lots</label>
            <div className="flex items-center bg-stone-50 border border-stone-100 rounded-lg overflow-hidden">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-4 hover:bg-stone-200 transition-colors"
              >
                -
              </button>
              <input 
                type="number" 
                value={quantity}
                readOnly
                className="w-full text-center bg-transparent outline-none font-bold" 
              />
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="px-4 py-4 hover:bg-stone-200 transition-colors"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 bg-primary text-white rounded-xl flex items-center justify-between shadow-lg">
          <span className="text-xs font-bold uppercase tracking-widest opacity-80">Total Shipping Weight</span>
          <span className="text-2xl font-display font-bold">{totalWeight} KG</span>
        </div>
      </div>

      <div className="p-4 bg-secondary/5 rounded-xl border-l-4 border-secondary flex items-start gap-3">
        <span className="material-symbols-outlined text-secondary">calendar_today</span>
        <div>
          <p className="text-sm font-bold text-on-surface">
            Harvesting: {product.harvest_date ? new Date(product.harvest_date).toLocaleDateString() : 'June 1st Week'}
          </p>
          <p className="text-[10px] text-stone-500 uppercase tracking-widest">Dynamic Split-Shipping Enabled</p>
        </div>
      </div>

      <button 
        onClick={handleAddToCart}
        className={`w-full py-5 text-white font-bold text-xs uppercase tracking-[0.2em] rounded-xl transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2 ${product.is_preorder ? 'bg-secondary hover:bg-secondary/90 shadow-secondary/20' : 'bg-primary hover:bg-primary-light shadow-primary/20'}`}
      >
        {product.is_preorder ? 'Pre-order Now' : 'Add to Fresh Cart'}
        <span className="material-symbols-outlined">{product.is_preorder ? 'preorder' : 'shopping_cart'}</span>
      </button>
      
      <p className="text-[10px] text-center text-stone-400 uppercase tracking-widest">
        {Number(product.available_stock) < 50 ? `Limited Stock: ${Number(product.available_stock)} units left` : "Fresh Harvest Guaranteed"}
      </p>
    </div>
  );
}
