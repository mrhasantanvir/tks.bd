import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductPurchaseCard from "@/components/ProductPurchaseCard";

export default async function ProductDetail({ params }: { params: { id: string } }) {
  const product = await prisma.products.findUnique({
    where: { id: parseInt(params.id) },
    include: { product_gallery: true }
  });

  if (!product) {
    notFound();
  }

  // Serialize Decimal objects to plain numbers for RSC/Client Component compatibility
  const serializedProduct = {
    ...product,
    price_per_unit: Number(product.price_per_unit),
    available_stock: Number(product.available_stock),
    preorder_booked: Number(product.preorder_booked),
  };

  // Fetch related products from same category
  const relatedProducts = (await prisma.products.findMany({
    where: { 
      category: serializedProduct.category,
      NOT: { id: serializedProduct.id }
    },
    take: 4
  })).map(p => ({ ...p, price_per_unit: Number(p.price_per_unit) }));

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-on-background pt-20">
      <main className="max-w-7xl mx-auto px-6 md:px-12 pt-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Advanced Image Gallery */}
          <div className="lg:col-span-7 space-y-4">
            <div className="overflow-hidden rounded-2xl border border-stone-100 bg-white shadow-sm aspect-video">
              <img 
                src={serializedProduct.image_url || "/placeholder.jpg"} 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                alt={serializedProduct.name}
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {serializedProduct.product_gallery.slice(0, 4).map((img: any, index: number) => (
                <div key={index} className="overflow-hidden rounded-xl border border-stone-100 bg-white shadow-sm aspect-square cursor-pointer hover:border-primary transition-all">
                  <img 
                    src={img.image_url || ""} 
                    className="w-full h-full object-cover"
                    alt={`${serializedProduct.name} Gallery ${index + 1}`}
                  />
                </div>
              ))}
              {/* Fill placeholders if less than 4 images */}
              {Array.from({ length: Math.max(0, 4 - (serializedProduct.product_gallery?.length || 0)) }).map((_, i) => (
                <div key={`fill-${i}`} className="bg-stone-100 rounded-xl aspect-square border border-stone-100 flex items-center justify-center opacity-40">
                   <span className="material-symbols-outlined text-stone-300">image</span>
                </div>
              ))}
            </div>
          </div>

          {/* Product Info Sidebar */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                {serializedProduct.is_preorder && (
                  <span className="px-3 py-1 bg-secondary text-white text-[8px] font-bold uppercase tracking-widest rounded-full animate-pulse">
                    Pre-order Open
                  </span>
                )}
                <span className="px-3 py-1 bg-primary/5 text-primary text-[8px] font-bold uppercase tracking-widest rounded-full border border-primary/10">
                  Chemical Free
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-primary tracking-tighter leading-tight">
                {serializedProduct.name}
              </h1>
              <p className="text-sm text-stone-500 leading-relaxed font-medium">
                {serializedProduct.short_description}
              </p>

              {/* Delivery Schedule Info */}
              {serializedProduct.category === 'mango' && serializedProduct.harvest_date && (
                <div className="mt-2 p-4 bg-accent/5 border border-accent/10 rounded-xl flex items-center gap-4">
                  <span className="material-symbols-outlined text-accent text-2xl">calendar_today</span>
                  <div>
                    <p className="text-[9px] font-bold text-accent uppercase tracking-widest">Delivery Schedule</p>
                    <p className="text-sm font-bold text-primary">ডেলিভারি শুরু হবে: {new Date(serializedProduct.harvest_date).toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' })} থেকে</p>
                  </div>
                </div>
              )}
            </div>

            <ProductPurchaseCard product={serializedProduct} />
          </div>
        </div>

        {/* Full-width Description Section */}
        <div className="mt-12 pt-12 border-t border-stone-200">
          <div className="max-w-4xl space-y-4">
            <h3 className="text-sm font-bold text-primary uppercase tracking-widest flex items-center gap-2">
              <span className="w-4 h-[1px] bg-accent"></span>
              About the Harvest
            </h3>
            <p className="text-sm md:text-base text-stone-600 leading-relaxed font-medium">
              {serializedProduct.detailed_description}
            </p>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <section className="mt-20">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-2xl font-display font-bold text-primary">Related from Orchard</h2>
              <div className="h-[1px] flex-1 bg-stone-100"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((item) => (
                <Link href={`/products/${item.id}`} key={item.id} className="group flex flex-col">
                  <div className="relative aspect-square rounded-2xl bg-white border border-stone-100 overflow-hidden mb-4 block shadow-sm hover:shadow-lg transition-all duration-500">
                    <img 
                      src={item.image_url || '/placeholder.jpg'} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      alt={item.name} 
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-sm font-display font-bold text-primary leading-none tracking-tight">{item.name}</h3>
                      <span className="text-xs font-bold text-on-background">৳{Number(item.price_per_unit)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
