const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Cleaning database...");
  try {
    await prisma.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 0;');
    const tables = ['product_gallery', 'order_items', 'order_packages', 'payments', 'reviews', 'sms_logs', 'orders', 'products', 'addresses', 'districts', 'upazilas'];
    for (const table of tables) {
      try {
        await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${table};`);
        console.log(`Truncated ${table}`);
      } catch (e) {
        console.log(`Table ${table} might not exist yet, skipping.`);
      }
    }
    await prisma.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 1;');
    console.log("Database cleaned!");
  } catch (error) {
    console.error("Error cleaning database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
