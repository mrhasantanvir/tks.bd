import Image from "next/image";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function Home() {
  // Fetch products by categories
  const mangoes = (await prisma.products.findMany({
    where: { categories: { slug: 'mango' } },
    take: 8,
    include: { categories: true, units: true },
    orderBy: { created_at: 'desc' }
  })).map(p => ({ ...p, price_per_unit: Number(p.price_per_unit) }));

  const teas = (await prisma.products.findMany({
    where: { categories: { slug: 'tea' } },
    take: 4,
    include: { categories: true, units: true },
    orderBy: { created_at: 'desc' }
  })).map(p => ({ ...p, price_per_unit: Number(p.price_per_unit) }));

  const gurs = (await prisma.products.findMany({
    where: { categories: { slug: 'gur' } },
    take: 4,
    include: { categories: true, units: true },
    orderBy: { created_at: 'desc' }
  })).map(p => ({ ...p, price_per_unit: Number(p.price_per_unit) }));

  const announcements = await prisma.site_announcements.findMany({
    where: { is_active: true },
    orderBy: { created_at: 'desc' }
  });

  const siteReviews = await prisma.reviews.findMany({
    where: { is_visible: true },
    orderBy: { created_at: 'desc' },
    take: 12
  });

  return (
    <div className="min-h-screen bg-[#fcfdfc] font-sans text-on-background selection:bg-primary/10 pt-10">
      <main>
        {/* Bright Analytical Hero Section (Screenshot Style) */}
        <section className="relative min-h-[20vh] flex flex-col items-center justify-center px-6 text-center overflow-hidden pt-4 pb-2">
          {/* Background Gradient & Grid */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#f0f9f1] via-[#fffdf0] to-white -z-10"></div>
          <div className="absolute inset-0 opacity-[0.03] -z-10" style={{backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px'}}></div>
          
          <div className="max-w-4xl mx-auto space-y-4 animate-fade-in">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1 bg-white border border-stone-100 rounded-full shadow-sm">
              <span className="text-[9px] font-bold text-emerald-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                Bangladesh's Most Trusted Orchard-to-Home Platform
              </span>
            </div>
            
            {/* Main Heading */}
            <h1 className="text-3xl md:text-6xl font-display font-black text-[#1a2b3c] leading-[1.1] tracking-tight">
              Authentic & Premium <br /> 
              <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-amber-500 bg-clip-text text-transparent">Organic Harvest</span>
            </h1>
            
            {/* Description */}
            <p className="text-[11px] md:text-sm text-stone-500 max-w-xl mx-auto leading-relaxed font-medium">
              Sourced directly from the lush orchards of Rajshahi and the finest tea gardens. 
              Experience 100% chemical-free organic produce, delivered directly to your table.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <Link href="#mangoes" className="px-6 py-3 bg-[#1a2b3c] text-white font-bold text-[9px] uppercase tracking-[0.2em] rounded-xl hover:scale-105 transition-all shadow-lg">
                Shop Collection
              </Link>
              <Link href="#contact" className="px-6 py-3 bg-white border border-stone-200 text-stone-600 font-bold text-[9px] uppercase tracking-[0.2em] rounded-xl hover:bg-stone-50 transition-all">
                Contact Orchard
              </Link>
            </div>
          </div>
        </section>

        {/* Premium News Ticker Bar (Contained) */}
        {announcements.length > 0 && (
          <div className="max-w-7xl mx-auto px-6 md:px-20 -mt-2 mb-4">
            <div className="bg-[#1a2b3c] py-2 overflow-hidden border border-white/5 relative flex items-center rounded-xl shadow-lg">
              {/* Fixed Label */}
              <div className="absolute left-0 top-0 bottom-0 px-4 bg-accent flex items-center z-20 shadow-[5px_0_15px_rgba(0,0,0,0.3)]">
                <span className="text-[8px] font-black text-primary uppercase tracking-[0.2em] whitespace-nowrap">Updates</span>
              </div>
              
              {/* Scrolling Content */}
              <div className="flex whitespace-nowrap animate-marquee hover:pause-marquee pl-[100px]">
                {[...announcements, ...announcements].map((msg: any, i: number) => (
                  <div key={i} className="flex items-center gap-4 mx-8 group">
                    <span className={`w-1 h-1 rounded-full ${msg.type === 'success' ? 'bg-emerald-400' : msg.type === 'warning' ? 'bg-amber-400' : 'bg-white/40'}`}></span>
                    <p className="text-[10px] md:text-xs font-bold text-white/80 uppercase tracking-widest flex items-center gap-2">
                      {msg.message}
                      {msg.link && (
                        <Link href={msg.link} className="text-accent hover:underline text-[9px] font-black ml-1">[DETAILS]</Link>
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Section Wrapper */}
        <div className="max-w-7xl mx-auto px-6 md:px-20">
          
          {/* Mangoes Section (Compact) */}
          <section id="mangoes" className="py-6 border-b border-stone-50">
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
              <div className="space-y-2">
                <h2 className="text-2xl font-display font-bold text-primary">Rajshahi Mango Varieties</h2>
                <div className="h-1 w-16 bg-accent"></div>
              </div>
              <p className="text-[9px] font-bold text-stone-300 uppercase tracking-widest">Hand-picked Excellence</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
              {mangoes.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
              {mangoes.length === 0 && <p className="col-span-4 text-center py-8 text-stone-300 italic">Seasonal mangoes arriving soon...</p>}
            </div>
          </section>

          {/* Tea Section (Compact) */}
          <section id="tea" className="py-6 border-b border-stone-50">
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
              <div className="space-y-2">
                <h2 className="text-2xl font-display font-bold text-primary">Premium Tea Garden</h2>
                <div className="h-1 w-16 bg-accent"></div>
              </div>
              <p className="text-[9px] font-bold text-stone-300 uppercase tracking-widest">Pure Organic Brew</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {teas.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
              {teas.length === 0 && <p className="col-span-4 text-center py-8 text-stone-300 italic">Selected teas being cured...</p>}
            </div>
          </section>

          {/* Gur Section (Compact) */}
          <section id="gur" className="py-6 border-b border-stone-50">
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
              <div className="space-y-2">
                <h2 className="text-2xl font-display font-bold text-primary">Heritage Date-Palm Gur</h2>
                <div className="h-1 w-16 bg-accent"></div>
              </div>
              <p className="text-[9px] font-bold text-stone-300 uppercase tracking-widest">Natural Sweetness</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {gurs.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
              {gurs.length === 0 && <p className="col-span-4 text-center py-8 text-stone-300 italic">Pure gur arriving this winter...</p>}
            </div>
          </section>

          {/* Scrolling Customer Reviews Section (Compact & Mobile Ready) */}
          <section id="reviews" className="py-8 border-b border-stone-100 overflow-hidden">
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-primary tracking-tighter">Harvest Diaries</h2>
              <p className="text-[8px] font-bold text-stone-300 uppercase tracking-[0.4em]">Verified Customer Experiences</p>
            </div>
            
            <div className="relative flex overflow-hidden">
              <div className="flex animate-marquee hover:pause-marquee whitespace-nowrap gap-6 py-4">
                {[...siteReviews, ...siteReviews].map((review, i) => (
                  <div key={i} className="inline-block w-[280px] md:w-[350px] bg-white p-6 rounded-[2rem] space-y-4 border border-stone-50 shadow-sm relative shrink-0">
                    <div className="flex justify-center mb-2">
                       <div className="w-16 h-16 rounded-full border-2 border-stone-50 overflow-hidden bg-stone-50 shadow-sm">
                          <img src={review.image_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${review.user_name}`} className="w-full h-full object-cover" alt="" />
                       </div>
                    </div>
                    <div className="flex justify-center text-accent gap-0.5">
                      {[...Array(5)].map((_, j) => (
                        <span key={j} className={`material-symbols-outlined text-[10px] ${j < review.rating ? 'text-accent' : 'text-stone-100'}`} style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                      ))}
                    </div>
                    <p className="text-[11px] text-stone-500 leading-relaxed font-medium whitespace-normal line-clamp-3 text-center">"{review.comment}"</p>
                    <div className="text-center pt-2">
                      <p className="font-bold text-primary text-[10px] uppercase tracking-widest">{review.user_name || review.users?.full_name || 'Verified Buyer'}</p>
                      <p className="text-[7px] text-stone-300 uppercase tracking-widest font-bold">Verified Buyer • {new Date(review.created_at).toLocaleDateString('bn-BD')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Contact Section (Compact) */}
          <section id="contact" className="py-6">
            <div className="bg-primary rounded-[2rem] p-8 md:p-16 text-center space-y-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-1/2 h-full bg-white opacity-[0.03] skew-x-[-20deg] translate-x-1/2"></div>
              <div className="space-y-2">
                <h2 className="text-2xl md:text-4xl font-display font-bold text-white tracking-tighter">Questions for the Orchard?</h2>
                <p className="text-white/60 font-bold text-[8px] uppercase tracking-[0.4em]">We're here to help you harvest purity</p>
              </div>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="tel:+8801700000000" className="px-8 py-4 bg-white text-primary font-bold text-[9px] uppercase tracking-[0.2em] rounded-xl flex items-center gap-3">
                  <span className="material-symbols-outlined text-sm">call</span> Call Now
                </a>
                <a href="https://wa.me/8801700000000" className="px-8 py-4 bg-accent text-primary font-bold text-[9px] uppercase tracking-[0.2em] rounded-xl flex items-center gap-3">
                  <span className="material-symbols-outlined text-sm">chat_bubble</span> WhatsApp
                </a>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function ProductCard({ product }: { product: any }) {
  return (
    <Link href={`/products/${product.id}`} className="group flex flex-col">
      <div className="relative aspect-square rounded-[2rem] bg-white border border-stone-100 overflow-hidden mb-4 block shadow-[0_8px_30px_rgb(0,0,0,0.02)] group-hover:shadow-[0_20px_50px_rgba(10,26,15,0.08)] transition-all duration-700">
        <img 
          src={product.image_url || '/placeholder.jpg'} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
          alt={product.name} 
        />
        {product.is_preorder && (
          <div className="absolute top-4 left-4 px-3 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[7px] font-bold uppercase tracking-widest rounded-full shadow-xl z-10">
            Pre-order Open
          </div>
        )}
      </div>
      <div className="px-2 space-y-1">
        <div className="flex justify-between items-baseline">
          <h3 className="text-sm font-display font-bold text-primary leading-none tracking-tight group-hover:text-accent transition-colors">{product.name}</h3>
          <div className="flex flex-col items-end">
             <span className="text-xs font-bold text-on-background">৳{Number(product.price_per_unit)}</span>
             {Number(product.regular_price) > Number(product.price_per_unit) && (
                <span className="text-[9px] text-stone-300 line-through font-bold">৳{Number(product.regular_price)}</span>
             )}
          </div>
        </div>
        {product.categories?.slug === 'mango' && product.harvest_date && (
          <p className="text-[9px] font-bold text-accent">
            ডেলিভারি: {new Date(product.harvest_date).toLocaleDateString('bn-BD', { day: 'numeric', month: 'short' })} থেকে
          </p>
        )}
        <p className="text-[10px] text-stone-400 line-clamp-1 font-medium">{product.short_description}</p>
      </div>
    </Link>
  );
}
