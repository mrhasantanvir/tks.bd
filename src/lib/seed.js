const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Force UTF8 session
  await prisma.$executeRawUnsafe("SET NAMES 'utf8mb4';");
  await prisma.$executeRawUnsafe("ALTER TABLE products CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;");

  await prisma.product_gallery.deleteMany();
  await prisma.order_items.deleteMany();
  await prisma.products.deleteMany();

  // 1. Mangoes (10 Items)
  const mangoVarieties = [
    "হিমসাগর প্রিমিয়াম", "ল্যাংড়া হেরিটেজ", "আম্রপালি গোল্ড", "ফজলি স্পেশাল", 
    "ক্ষীরসাপাত", "গোপালভোগ", "লক্ষণভোগ", "আশ্বিনা", "কাটিমন (বারোমাসি)", "মল্লিকা"
  ];
  const mangoImages = ["photo-1553331002-3983dde2086b", "photo-1591073113125-e46713c829ed", "photo-1601493700631-2b16ec4b4716", "photo-1553331002-3983dde2086b", "photo-1591073113125-e46713c829ed", "photo-1601493700631-2b16ec4b4716", "photo-1553331002-3983dde2086b", "photo-1591073113125-e46713c829ed", "photo-1601493700631-2b16ec4b4716", "photo-1553331002-3983dde2086b"];

  for (let i = 0; i < 10; i++) {
    const isPreorder = i < 5;
    const harvestDate = new Date();
    harvestDate.setDate(harvestDate.getDate() + 20 + (i * 2));

    const p = await prisma.products.create({
      data: {
        name: mangoVarieties[i],
        short_description: "রাজশাহীর বাগান থেকে সরাসরি সংগৃহীত ১০০% অর্গানিক এবং কেমিক্যাল মুক্ত আম।",
        detailed_description: "আমাদের এই আমগুলো রাজশাহীর ঐতিহ্যবাহী বাগান থেকে সরাসরি সংগ্রহ করা হয়েছে। কোনো প্রকার ফরমালিন বা কার্বাইড ছাড়াই প্রাকৃতিকভাবে পাকানো হয়েছে। স্বাদে এবং গন্ধে অতুলনীয় এই আম আপনার পরিবারের জন্য সম্পূর্ণ নিরাপদ। ডেলিভারি শুরু হবে আম গাছে পুরোপুরি পাকার পর।",
        price_per_kg: 95 + (i * 5),
        lot_size: 12,
        category: 'mango',
        image_url: `https://images.unsplash.com/${mangoImages[i]}?auto=format&fit=crop&q=80&w=800`,
        available_stock: 500,
        is_preorder: isPreorder,
        harvest_date: harvestDate
      }
    });
    
    await prisma.product_gallery.createMany({
      data: [
        { product_id: p.id, image_url: "https://images.unsplash.com/photo-1591073113125-e46713c829ed?auto=format&fit=crop&q=80&w=800" },
        { product_id: p.id, image_url: "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?auto=format&fit=crop&q=80&w=800" },
        { product_id: p.id, image_url: "https://images.unsplash.com/photo-1553331002-3983dde2086b?auto=format&fit=crop&q=80&w=800" },
        { product_id: p.id, image_url: "https://images.unsplash.com/photo-1591073113125-e46713c829ed?auto=format&fit=crop&q=80&w=800" }
      ]
    });
  }

  // 2. Tea (10 Items)
  for (let i = 0; i < 10; i++) {
    await prisma.products.create({
      data: {
        name: `প্রিমিয়াম চা পাতা - ${i + 1}`,
        short_description: "সিলেটের বাগান থেকে বাছাইকৃত ফ্রেশ চা পাতা।",
        detailed_description: "সরাসরি সিলেটের চা বাগান থেকে সংগৃহীত। উন্নত প্রক্রিয়াজাতকরণের মাধ্যমে চায়ের আসল স্বাদ এবং সুগন্ধ অক্ষুণ্ণ রাখা হয়েছে। প্রতিদিনের ক্লান্তি দূর করতে আমাদের এই প্রিমিয়াম চা অতুলনীয়।",
        price_per_kg: 450 + (i * 20),
        lot_size: 1,
        category: 'tea',
        image_url: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&q=80&w=800",
        available_stock: 100
      }
    });
  }

  // 3. Gur (10 Items)
  for (let i = 0; i < 10; i++) {
    await prisma.products.create({
      data: {
        name: `খাঁটি খেজুরের গুড় - ${i + 1}`,
        short_description: "যশোরের ঐতিহ্যবাহী ভেজালমুক্ত খাঁটি খেজুরের গুড়।",
        detailed_description: "শীতের সকালে সংগৃহীত খাঁটি খেজুরের রস থেকে তৈরি এই গুড় সম্পূর্ণ কেমিক্যাল মুক্ত। এতে কোনো প্রকার চিনি বা কৃত্রিম রং মেশানো হয়নি। পিঠা-পুলি বা পায়েসের আসল স্বাদ পেতে আমাদের এই গুড় সেরা।",
        price_per_kg: 380 + (i * 15),
        lot_size: 1,
        category: 'gur',
        image_url: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&q=80&w=800",
        available_stock: 200
      }
    });
  }

  console.log("Seeding complete with UTF8 force!");
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
