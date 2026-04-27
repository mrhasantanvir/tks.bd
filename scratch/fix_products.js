const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function fix() {
  try {
    // 1. Ensure a default category exists
    let cat = await prisma.categories.findFirst({ where: { slug: 'general' } });
    if (!cat) {
      cat = await prisma.categories.create({ data: { name: 'General', slug: 'general' } });
    }

    // 2. Ensure a default unit exists
    let unit = await prisma.units.findFirst({ where: { name: 'kg' } });
    if (!unit) {
      unit = await prisma.units.create({ data: { name: 'kg' } });
    }

    // 3. Assign all products to this category and unit if they are null
    const count = await prisma.products.updateMany({
      where: { category_id: null },
      data: { category_id: cat.id, unit_id: unit.id }
    });

    console.log(`Updated ${count.count} products with default category/unit.`);
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

fix();
