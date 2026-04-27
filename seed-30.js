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
    const mangoType = mangoNames[i % mangoNames.length];
    const name = `${mangoType} Premium Variant ${i}`;
    const p = await prisma.products.create({
      data: {
        name: name,
        short_description: `Authentic ${mangoType} from Rajshahi, known for its incredible sweetness and aroma.`,
        detailed_description: `Experience the true flavor of the "King of Fruits" with our ${name}. Sourced directly from the sun-drenched orchards of Rajshahi, these mangoes are grown using traditional organic methods without any harmful chemicals or carbides. Each mango is hand-picked at the perfect stage of maturity to ensure maximum sweetness and a buttery, fiber-less texture. Perfect for summer desserts or enjoying fresh. We guarantee 100% purity and safe delivery to your doorstep.`,
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
    await prisma.product_gallery.create({ data: { product_id: p.id, image_url: '/uploads/premium_mango.png' } });
  }

  // --- Tea (30 Products) ---
  for (let i = 1; i <= 30; i++) {
    const teaType = teaNames[i % teaNames.length];
    const name = `${teaType} - Estate Selection ${i}`;
    const p = await prisma.products.create({
      data: {
        name: name,
        short_description: `Finest hand-picked tea leaves from the high-altitude gardens of Sreemangal.`,
        detailed_description: `Indulge in the sophisticated flavors of our ${name}. This exclusive estate selection features young, tender leaves harvested during the prime flush. Each batch is carefully withered, rolled, and oxidized under expert supervision to bring out a complex profile of floral notes and a smooth, malty finish. Rich in antioxidants and naturally refreshing, this tea is perfect for your morning ritual or afternoon relaxation. Packaged in air-tight foil to preserve freshness and aroma.`,
        price_per_unit: 300 + (i * 10),
        regular_price: 400 + (i * 10),
        available_stock: 200,
        image_url: '/uploads/premium_tea.png',
        category_id: teaCat.id,
        unit_id: packetUnit.id
      }
    });
    await prisma.product_gallery.create({ data: { product_id: p.id, image_url: '/uploads/premium_tea.png' } });
  }

  // --- Gur (30 Products) ---
  for (let i = 1; i <= 30; i++) {
    const gurType = gurNames[i % gurNames.length];
    const name = `${gurType} - Traditional Heritage ${i}`;
    const p = await prisma.products.create({
      data: {
        name: name,
        short_description: `Unadulterated date-palm jaggery made using centuries-old traditional techniques.`,
        detailed_description: `Our ${name} is a seasonal delicacy that embodies the spirit of Bengal's winters. Collected at the crack of dawn from selected date trees, the sap is slowly boiled in large earthen or iron pots over wood fires. This slow-cooking process develops a unique smoky aroma and a rich, fudge-like sweetness that is incomparable to commercial sugars. Absolutely no alum, preservatives, or artificial colors are added. High in iron and magnesium, it is both a healthy sweetener and a gourmet treat for making classic Pithas and Payesh.`,
        price_per_unit: 200 + (i * 5),
        regular_price: 300 + (i * 5),
        available_stock: 100,
        image_url: '/uploads/premium_gur.png',
        category_id: gurCat.id,
        unit_id: kgUnit.id
      }
    });
    await prisma.product_gallery.create({ data: { product_id: p.id, image_url: '/uploads/premium_gur.png' } });
  }

  console.log('✅ Successfully seeded 90 premium products!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
