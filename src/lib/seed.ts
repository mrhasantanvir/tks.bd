import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Clear existing products
  await prisma.product_gallery.deleteMany();
  await prisma.order_items.deleteMany();
  await prisma.products.deleteMany();
  await prisma.lots.deleteMany();
  await prisma.categories.deleteMany();
  await prisma.units.deleteMany();

  // 1. Create Units
  const kg = await prisma.units.create({ data: { name: 'kg' } });
  const liter = await prisma.units.create({ data: { name: 'liter' } });

  // 2. Create Categories
  const mangoCat = await prisma.categories.create({ data: { name: 'আম (Mango)', slug: 'mango' } });
  const teaCat = await prisma.categories.create({ data: { name: 'চা (Tea)', slug: 'tea' } });
  const gurCat = await prisma.categories.create({ data: { name: 'গুড় (Gur)', slug: 'gur' } });

  // 3. Create Lots Templates
  const mangoLot12 = await prisma.lots.create({ data: { name: '১২ কেজি প্রিমিয়াম লট', size: 12, packaging_charge: 150, category_id: mangoCat.id } });
  const mangoLot22 = await prisma.lots.create({ data: { name: '২২ কেজি কমার্শিয়াল লট', size: 22, packaging_charge: 250, category_id: mangoCat.id } });

  // 4. Mango Products
  const mangoProducts = [
    {
      name: "রাজশাহী প্রিমিয়াম হিমসাগর",
      short_description: "আসল হিমসাগর আমের অতুলনীয় স্বাদ।",
      detailed_description: "রাজশাহীর বাগান থেকে সরাসরি সংগৃহীত ১০০% ফরমালিন মুক্ত হিমসাগর আম।",
      price_per_unit: 110,
      lot_size: 12,
      packaging_charge: 150,
      category_id: mangoCat.id,
      unit_id: kg.id,
      image_url: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&q=80",
      available_stock: 1000,
      is_preorder: true,
      harvest_date: new Date("2026-05-20")
    },
    {
      name: "ল্যাংড়া হেরিটেজ আম",
      short_description: "অপূর্ব সুগন্ধ এবং পাতলা খোসার ল্যাংড়া আম।",
      detailed_description: "ঐতিহ্যবাহী ল্যাংড়া আম, যা তার বিশেষ সুগন্ধের জন্য বিখ্যাত।",
      price_per_unit: 95,
      lot_size: 12,
      packaging_charge: 150,
      category_id: mangoCat.id,
      unit_id: kg.id,
      image_url: "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?auto=format&fit=crop&q=80",
      available_stock: 500,
      is_preorder: false
    },
    {
      name: "ফজলী শাহী আম",
      short_description: "বিশাল আকৃতির মিষ্টি ফজলী আম।",
      detailed_description: "আকারে বড় এবং অত্যন্ত মিষ্টি ফজলী আম।",
      price_per_unit: 80,
      lot_size: 22,
      packaging_charge: 250,
      category_id: mangoCat.id,
      unit_id: kg.id,
      image_url: "https://images.unsplash.com/photo-1591073113125-e46713c829ed?auto=format&fit=crop&q=80",
      available_stock: 800,
      is_preorder: false
    }
  ];

  for (const m of mangoProducts) {
    await prisma.products.create({ data: m as any });
  }

  // 5. Tea Products
  const teaProducts = [
    {
      name: "শ্রীমঙ্গল অর্গানিক গ্রিন টি",
      short_description: "সিলেটের বাগান থেকে সরাসরি সংগৃহীত।",
      detailed_description: "স্বাস্থ্যসম্মত এবং সতেজ শ্রীমঙ্গলের সেরা গ্রিন টি।",
      price_per_unit: 1450,
      lot_size: 1,
      packaging_charge: 0,
      category_id: teaCat.id,
      unit_id: kg.id,
      image_url: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&q=80",
      available_stock: 200
    },
    {
      name: "প্রিমিয়াম ব্ল্যাক টি (বিওপি)",
      short_description: "কড়া লিকার এবং চমৎকার ফ্লেভার।",
      detailed_description: "প্রতিদিনের সতেজতার জন্য সেরা মানের ব্ল্যাক টি।",
      price_per_unit: 550,
      lot_size: 1,
      packaging_charge: 0,
      category_id: teaCat.id,
      unit_id: kg.id,
      image_url: "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&q=80",
      available_stock: 400
    }
  ];

  for (const t of teaProducts) {
    await prisma.products.create({ data: t as any });
  }

  // 6. Gur Products
  const gurProducts = [
    {
      name: "খাঁটি নলেন গুড় (তরল)",
      short_description: "শীতের সকালের টাটকা খেজুরের গুড়।",
      detailed_description: "যশোরের বিখ্যাত নলেন গুড়, কোনো প্রকার চিনি মেশানো নেই।",
      price_per_unit: 480,
      lot_size: 1,
      packaging_charge: 20,
      category_id: gurCat.id,
      unit_id: kg.id,
      image_url: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&q=80",
      available_stock: 300
    },
    {
      name: "পাটালি গুড় (প্রিমিয়াম)",
      short_description: "দানাদার এবং সুস্বাদু পাটালি গুড়।",
      detailed_description: "পিঠা ও পায়েসের জন্য আদর্শ খাঁটি পাটালি গুড়।",
      price_per_unit: 550,
      lot_size: 1,
      packaging_charge: 20,
      category_id: gurCat.id,
      unit_id: kg.id,
      image_url: "https://images.unsplash.com/photo-1608472562442-536965413df4?auto=format&fit=crop&q=80",
      available_stock: 250
    }
  ];

  for (const g of gurProducts) {
    await prisma.products.create({ data: g as any });
  }

  console.log("Seeding complete with professional demo data!");
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
