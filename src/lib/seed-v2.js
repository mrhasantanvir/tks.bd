const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Categories & Units...");
  
  const mangoCat = await prisma.categories.upsert({
    where: { slug: 'mango' },
    update: {},
    create: { name: 'Mango (আম)', slug: 'mango' }
  });

  const teaCat = await prisma.categories.upsert({
    where: { slug: 'tea' },
    update: {},
    create: { name: 'Tea (চা)', slug: 'tea' }
  });

  const gurCat = await prisma.categories.upsert({
    where: { slug: 'gur' },
    update: {},
    create: { name: 'Gur (গুড়)', slug: 'gur' }
  });

  const honeyCat = await prisma.categories.upsert({
    where: { slug: 'honey' },
    update: {},
    create: { name: 'Honey (মধু)', slug: 'honey' }
  });

  const kgUnit = await prisma.units.upsert({
    where: { name: 'KG' },
    update: {},
    create: { name: 'KG' }
  });

  const literUnit = await prisma.units.upsert({
    where: { name: 'Liter' },
    update: {},
    create: { name: 'Liter' }
  });

  const pieceUnit = await prisma.units.upsert({
    where: { name: 'Piece' },
    update: {},
    create: { name: 'Piece' }
  });

  console.log("Seeding 10 products for each category...");

  const categories = [
    { cat: mangoCat, prefix: 'Premium Mango', unit: kgUnit, lots: [12, 22], pkg: [150, 250] },
    { cat: teaCat, prefix: 'Organic Tea', unit: kgUnit, lots: [1, 2], pkg: [20, 40] },
    { cat: gurCat, prefix: 'Natural Gur', unit: kgUnit, lots: [5, 10], pkg: [50, 100] },
    { cat: honeyCat, prefix: 'Sundarban Honey', unit: literUnit, lots: [1, 5], pkg: [30, 80] },
  ];

  for (const item of categories) {
    for (let i = 1; i <= 10; i++) {
      const lot = item.lots[i % 2];
      const pkgCharge = item.pkg[i % 2];
      
      await prisma.products.create({
        data: {
          name: `${item.prefix} Batch #${i}`,
          short_description: `High quality ${item.cat.name} sourced directly from local farmers.`,
          price_per_unit: 150 + (i * 10),
          available_stock: 500,
          lot_size: lot,
          packaging_charge: pkgCharge,
          categories: { connect: { id: item.cat.id } },
          units: { connect: { id: item.unit.id } },
          image_url: `https://images.unsplash.com/photo-${1500000000000 + (i * 1000)}?auto=format&fit=crop&q=80&w=800`,
          allow_home_delivery: true,
          allow_point_delivery: true,
          available_couriers: JSON.stringify(['steadfast', 'pathao', 'sundarban']),
          payment_policy: 'cod'
        }
      });
    }
  }

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
