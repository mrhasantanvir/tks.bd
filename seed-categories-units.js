const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const categories = [
    { name: 'Mango (আম)', slug: 'mango' },
    { name: 'Tea (চা)', slug: 'tea' },
    { name: 'Honey (মধু)', slug: 'honey' },
    { name: 'Gur (গুড়)', slug: 'gur' },
    { name: 'Others (অন্যান্য)', slug: 'others' }
  ];

  const units = [
    { name: 'KG' },
    { name: 'Gram' },
    { name: 'Liter' },
    { name: 'Piece' }
  ];

  for (const cat of categories) {
    await prisma.categories.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat
    });
  }

  for (const unit of units) {
    await prisma.units.upsert({
      where: { name: unit.name },
      update: {},
      create: unit
    });
  }

  console.log('Categories and Units seeded successfully');
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
