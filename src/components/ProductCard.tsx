"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ProductCardProps {
  product: any;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const router = useRouter();
  const [isAdded, setIsAdded] = useState(false);

  const price = Number(product.price_per_unit);
  const regularPrice = Number(product.regular_price || 0);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart({
      id: product.id,
      name: product.name,
      price_per_unit: price,
      unit_type: product.units?.name || 'kg',
      lotSize: Number(product.lot_size || 1),
      quantity: 1,
      harvest_date: product.harvest_date ? product.harvest_date.toString() : null,
      image_url: product.image_url,
      allow_home_delivery: product.allow_home_delivery ?? true,
      allow_point_delivery: product.allow_point_delivery ?? true,
      available_couriers: JSON.parse(product.available_couriers || '["Steadfast", "Sundarban"]'),
      payment_policy: product.payment_policy || 'cod',
      partial_advance_val: product.partial_advance_val ? Number(product.partial_advance_val) : null,
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart({
      id: product.id,
      name: product.name,
      price_per_unit: price,
      unit_type: product.units?.name || 'kg',
      lotSize: Number(product.lot_size || 1),
      quantity: 1,
      harvest_date: product.harvest_date ? product.harvest_date.toString() : null,
      image_url: product.image_url,
      allow_home_delivery: product.allow_home_delivery ?? true,
      allow_point_delivery: product.allow_point_delivery ?? true,
      available_couriers: JSON.parse(product.available_couriers || '["Steadfast", "Sundarban"]'),
      payment_policy: product.payment_policy || 'cod',
      partial_advance_val: product.partial_advance_val ? Number(product.partial_advance_val) : null,
    });

    router.push('/checkout');
  };

  return (
    <div className="group flex flex-col h-full bg-white rounded-[2rem] p-4 border border-stone-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(10,26,15,0.08)] transition-all duration-500 relative">
      <Link href={`/products/${product.id}`} className="block relative aspect-square rounded-2xl overflow-hidden mb-4">
        <img 
          src={product.image_url || '/placeholder.jpg'} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
          alt={product.name} 
        />
        {product.is_preorder && (
          <div className="absolute top-4 left-4 px-3 py-1.5 bg-black/60 backdrop-blur-md border border-white/20 text-white text-[7px] font-bold uppercase tracking-widest rounded-full shadow-xl z-10">
            Pre-order Open
          </div>
        )}
        
        {/* Hover Overlay with Icons */}
        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
            <button 
              onClick={handleAddToCart}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary shadow-xl hover:scale-110 transition-transform"
              title="Add to Cart"
            >
              <span className="material-symbols-outlined text-xl">{isAdded ? 'done' : 'shopping_bag'}</span>
            </button>
            <button 
              onClick={handleBuyNow}
              className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-primary shadow-xl hover:scale-110 transition-transform"
              title="Buy Now"
            >
              <span className="material-symbols-outlined text-xl">bolt</span>
            </button>
        </div>
      </Link>

      <div className="flex-1 space-y-2">
        <div className="flex justify-between items-start gap-2">
          <Link href={`/products/${product.id}`}>
            <h3 className="text-xs md:text-sm font-display font-black text-primary leading-tight tracking-tight group-hover:text-accent transition-colors line-clamp-2 uppercase">
              {product.name}
            </h3>
          </Link>
          <div className="flex flex-col items-end shrink-0">
             <span className="text-xs md:text-sm font-black text-primary tracking-tighter">৳{price}</span>
             {regularPrice > price && (
                <span className="text-[8px] md:text-[10px] text-stone-300 line-through font-bold">৳{regularPrice}</span>
             )}
          </div>
        </div>

        {product.categories?.slug === 'mango' && product.harvest_date && (
          <p className="text-[8px] md:text-[9px] font-black text-emerald-600 bg-emerald-50 w-fit px-2 py-0.5 rounded-full uppercase tracking-widest">
            ডেলিভারি: {new Date(product.harvest_date).toLocaleDateString('bn-BD', { day: 'numeric', month: 'short' })}
          </p>
        )}

        <p className="text-[9px] md:text-[10px] text-stone-400 line-clamp-2 font-medium leading-relaxed">
          {product.short_description}
        </p>
      </div>

      {/* Action Buttons Footer */}
      <div className="mt-4 pt-4 border-t border-stone-50 grid grid-cols-2 gap-2">
        <button 
          onClick={handleAddToCart}
          className={`py-2.5 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${isAdded ? 'bg-emerald-500 text-white' : 'bg-stone-100 text-primary hover:bg-primary hover:text-white'}`}
        >
          <span className="material-symbols-outlined text-[14px]">{isAdded ? 'done' : 'add_shopping_cart'}</span>
          {isAdded ? 'Added' : 'Add'}
        </button>
        <button 
          onClick={handleBuyNow}
          className="py-2.5 bg-primary text-white rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-accent hover:text-primary transition-all flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-[14px]">flash_on</span>
          {product.is_preorder ? 'Pre-order' : 'Buy Now'}
        </button>
      </div>
    </div>
  );
}
