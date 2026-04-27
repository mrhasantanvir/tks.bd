const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function check() {
  try {
    const count = await prisma.products.count();
    console.log("Product Count:", count);
    const products = await prisma.products.findMany({ take: 5, include: { categories: true, units: true } });
    console.log("Samples:", JSON.stringify(products, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

check();
