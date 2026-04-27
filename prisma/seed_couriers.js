const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const courierList = [
    { name: 'Steadfast Logistics', type: 'online' },
    { name: 'Pathao Courier', type: 'online' },
    { name: 'RedX Delivery', type: 'online' },
    { name: 'Paperfly', type: 'online' },
    { name: 'Sundarban Courier', type: 'online' },
    { name: 'SA Paribahan', type: 'offline' },
    { name: 'Karatoa Courier', type: 'offline' },
    { name: 'Janani Express', type: 'offline' },
    { name: 'E-Desh', type: 'online' },
  ];

  console.log('Seeding couriers...');

  for (const courier of courierList) {
    await prisma.couriers.upsert({
      where: { name: courier.name },
      update: { type: courier.type },
      create: { name: courier.name, type: courier.type },
    });
  }

  console.log('Couriers seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
