const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding premium product data...');

  // 1. Create or Update Categories
  const mangoCat = await prisma.category.upsert({
    where: { name: 'Mangoes' },
    update: {},
    create: { name: 'Mangoes', description: 'Fresh Rajshahi Mangoes' }
  });

  const teaCat = await prisma.category.upsert({
    where: { name: 'Tea' },
    update: {},
    create: { name: 'Tea', description: 'Premium Sreemangal Tea' }
  });

  const gurCat = await prisma.category.upsert({
    where: { name: 'Date-Palm Gur' },
    update: {},
    create: { name: 'Date-Palm Gur', description: 'Traditional Heritage Gur' }
  });

  // 2. Create Units
  const kgUnit = await prisma.unit.upsert({
    where: { name: 'KG' },
    update: {},
    create: { name: 'KG' }
  });

  const packetUnit = await prisma.unit.upsert({
    where: { name: 'Packet' },
    update: {},
    create: { name: 'Packet' }
  });

  // 3. Create Lots for Mangoes
  const lot5kg = await prisma.lot.upsert({
    where: { id: 1 },
    update: { name: '5 KG Lot', weight: 5, packaging_charge: 50, courier_charge: 100 },
    create: { id: 1, name: '5 KG Lot', weight: 5, packaging_charge: 50, courier_charge: 100, category_id: mangoCat.id }
  });

  const lot10kg = await prisma.lot.upsert({
    where: { id: 2 },
    update: { name: '10 KG Lot', weight: 10, packaging_charge: 80, courier_charge: 180 },
    create: { id: 2, name: '10 KG Lot', weight: 10, packaging_charge: 80, courier_charge: 180, category_id: mangoCat.id }
  });

  // 4. Create Premium Products
  await prisma.product.create({
    data: {
      name: 'Premium Rajshahi Himsagar',
      description: 'The king of mangoes, sourced directly from the finest orchards of Rajshahi. Naturally ripened, chemical-free, and incredibly sweet with a buttery texture.',
      price: 120,
      regular_price: 150,
      stock: 500,
      image_url: '/uploads/premium_mango.png',
      category_id: mangoCat.id,
      unit_id: kgUnit.id
    }
  });

  await prisma.product.create({
    data: {
      name: 'Sreemangal Organic Black Tea',
      description: 'Hand-picked premium black tea from the lush gardens of Sreemangal. Rich aroma, deep amber color, and a refreshing taste in every sip.',
      price: 450,
      regular_price: 550,
      stock: 200,
      image_url: '/uploads/premium_tea.png',
      category_id: teaCat.id,
      unit_id: packetUnit.id
    }
  });

  await prisma.product.create({
    data: {
      name: 'Heritage Nolen Gur (Liquid)',
      description: 'Traditional date-palm jaggery collected at dawn. Pure, unadulterated, and rich in natural minerals. Perfect for traditional Bengali desserts.',
      price: 350,
      regular_price: 400,
      stock: 100,
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
