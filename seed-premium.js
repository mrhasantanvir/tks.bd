const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Cleaning old data...');
  // Note: Model names in Prisma client match the schema model names (plural here)
  await prisma.order_items.deleteMany({});
  await prisma.product_gallery.deleteMany({});
  await prisma.reviews.deleteMany({});
  await prisma.products.deleteMany({});
  await prisma.lots.deleteMany({});
  await prisma.categories.deleteMany({});
  await prisma.units.deleteMany({});

  console.log('🌱 Seeding premium product data...');

  // 1. Create Categories with correct Slugs
  const mangoCat = await prisma.categories.create({
    data: { name: 'Mangoes', slug: 'mango' }
  });

  const teaCat = await prisma.categories.create({
    data: { name: 'Tea', slug: 'tea' }
  });

  const gurCat = await prisma.categories.create({
    data: { name: 'Date-Palm Gur', slug: 'gur' }
  });

  // 2. Create Units
  const kgUnit = await prisma.units.create({
    data: { name: 'KG' }
  });

  const packetUnit = await prisma.units.create({
    data: { name: 'Packet' }
  });

  // 3. Create Lots for Mangoes
  await prisma.lots.create({
    data: { name: '5 KG Lot', size: 5, packaging_charge: 50, category_id: mangoCat.id }
  });

  await prisma.lots.create({
    data: { name: '10 KG Lot', size: 10, packaging_charge: 80, category_id: mangoCat.id }
  });

  // 4. Create Premium Products
  await prisma.products.create({
    data: {
      name: 'Premium Rajshahi Himsagar',
      short_description: 'The king of mangoes, sourced directly from the finest orchards of Rajshahi.',
      detailed_description: 'Naturally ripened, chemical-free, and incredibly sweet with a buttery texture. Each mango is hand-picked at peak ripeness.',
      price_per_unit: 120,
      regular_price: 150,
      available_stock: 500,
      image_url: '/uploads/premium_mango.png',
      category_id: mangoCat.id,
      unit_id: kgUnit.id,
      harvest_date: new Date('2026-05-15'),
      is_preorder: true
    }
  });

  await prisma.products.create({
    data: {
      name: 'Sreemangal Organic Black Tea',
      short_description: 'Hand-picked premium black tea from the lush gardens of Sreemangal.',
      detailed_description: 'Rich aroma, deep amber color, and a refreshing taste in every sip. Processed naturally to preserve the authentic garden flavor.',
      price_per_unit: 450,
      regular_price: 550,
      available_stock: 200,
      image_url: '/uploads/premium_tea.png',
      category_id: teaCat.id,
      unit_id: packetUnit.id
    }
  });

  await prisma.products.create({
    data: {
      name: 'Heritage Nolen Gur (Liquid)',
      short_description: 'Traditional date-palm jaggery collected at dawn in the winter morning.',
      detailed_description: 'Pure, unadulterated, and rich in natural minerals. Collected from selected trees using traditional methods.',
      price_per_unit: 350,
      regular_price: 400,
      available_stock: 100,
      image_url: '/uploads/premium_gur.png',
      category_id: gurCat.id,
      unit_id: kgUnit.id
    }
  });

  console.log('✅ Premium data seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
