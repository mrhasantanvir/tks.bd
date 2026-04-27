const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Cleaning old data...');
  await prisma.order_items.deleteMany({});
  await prisma.product_gallery.deleteMany({});
  await prisma.reviews.deleteMany({});
  await prisma.products.deleteMany({});
  await prisma.lots.deleteMany({});
  await prisma.categories.deleteMany({});
  await prisma.units.deleteMany({});

  console.log('🌱 Seeding 90 premium products (30 per category)...');

  // 1. Categories
  const mangoCat = await prisma.categories.create({ data: { name: 'Mangoes', slug: 'mango' } });
  const teaCat = await prisma.categories.create({ data: { name: 'Tea', slug: 'tea' } });
  const gurCat = await prisma.categories.create({ data: { name: 'Date-Palm Gur', slug: 'gur' } });

  // 2. Units
  const kgUnit = await prisma.units.create({ data: { name: 'KG' } });
  const packetUnit = await prisma.units.create({ data: { name: 'Packet' } });

  // 3. Lots
  await prisma.lots.create({ data: { name: '5 KG Box', size: 5, packaging_charge: 50, category_id: mangoCat.id } });
  await prisma.lots.create({ data: { name: '10 KG Box', size: 10, packaging_charge: 80, category_id: mangoCat.id } });

  const mangoNames = ['Himsagar', 'Langra', 'Amrapali', 'Fazli', 'Gopalbhog', 'Khirsapati', 'Lakkhanbhog', 'Ashwini', 'Mallika', 'Chousa'];
  const teaNames = ['Premium Black Tea', 'Organic Green Tea', 'Silver Needle White Tea', 'Oolong Specialty', 'Masala Chai Blend', 'Earl Grey Heritage'];
  const gurNames = ['Nolen Gur (Liquid)', 'Patali Gur (Solid)', 'Jhola Gur', 'Dhana Gur', 'Premium Khejur Gur'];

  // --- Mangoes (30 Products) ---
  for (let i = 1; i <= 30; i++) {
    const name = `${mangoNames[i % mangoNames.length]} Variant ${i}`;
    const p = await prisma.products.create({
      data: {
        name: name,
        short_description: `Freshly harvested ${name} from Rajshahi orchards.`,
        detailed_description: `Enjoy the authentic taste of Rajshahi with our ${name}. Naturally grown and hand-picked for the best quality.`,
        price_per_unit: 100 + (i * 2),
        regular_price: 150 + (i * 2),
        available_stock: 500,
        image_url: '/uploads/premium_mango.png',
        category_id: mangoCat.id,
        unit_id: kgUnit.id,
        is_preorder: i % 5 === 0,
        harvest_date: new Date('2026-05-15')
      }
    });
    // Add to gallery
    await prisma.product_gallery.create({ data: { product_id: p.id, image_url: '/uploads/premium_mango.png' } });
  }

  // --- Tea (30 Products) ---
  for (let i = 1; i <= 30; i++) {
    const name = `${teaNames[i % teaNames.length]} Batch ${i}`;
    const p = await prisma.products.create({
      data: {
        name: name,
        short_description: `Exquisite ${name} from Sreemangal gardens.`,
        detailed_description: `Experience the rich aroma and flavor of our ${name}. Carefully processed to maintain purity and freshness.`,
        price_per_unit: 300 + (i * 10),
        regular_price: 400 + (i * 10),
        available_stock: 200,
        image_url: '/uploads/premium_tea.png',
        category_id: teaCat.id,
        unit_id: packetUnit.id
      }
    });
    // Add to gallery
    await prisma.product_gallery.create({ data: { product_id: p.id, image_url: '/uploads/premium_tea.png' } });
  }

  // --- Gur (30 Products) ---
  for (let i = 1; i <= 30; i++) {
    const name = `${gurNames[i % gurNames.length]} Grade ${i}`;
    const p = await prisma.products.create({
      data: {
        name: name,
        short_description: `Pure and authentic ${name} from local artisans.`,
        detailed_description: `Our ${name} is made using traditional methods to preserve its natural sweetness and nutritional value.`,
        price_per_unit: 200 + (i * 5),
        regular_price: 300 + (i * 5),
        available_stock: 100,
        image_url: '/uploads/premium_gur.png',
        category_id: gurCat.id,
        unit_id: kgUnit.id
      }
    });
    // Add to gallery
    await prisma.product_gallery.create({ data: { product_id: p.id, image_url: '/uploads/premium_gur.png' } });
  }

  console.log('✅ Successfully seeded 90 premium products!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
