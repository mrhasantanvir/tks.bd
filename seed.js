const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding dummy data...');

  // Create Mangoes
  await prisma.products.create({
    data: {
      name: 'Premium Himsagor Mango',
      short_description: 'Sweet and fresh from Rajshahi',
      detailed_description: 'The best quality Himsagor mangoes directly from our own orchards in Rajshahi.',
      price_per_unit: 120,
      unit_type: 'kg',
      available_stock: 500,
      category: 'mango',
      image_url: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
      is_preorder: true,
      harvest_date: new Date('2026-05-20')
    }
  });

  await prisma.products.create({
    data: {
      name: 'Langra Mango',
      short_description: 'Juicy and aromatic Langra',
      detailed_description: 'Aromatic Langra mangoes with thin skin and juicy pulp.',
      price_per_unit: 110,
      unit_type: 'kg',
      available_stock: 300,
      category: 'mango',
      image_url: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
    }
  });

  // Create Tea
  await prisma.products.create({
    data: {
      name: 'Sylhet Organic Black Tea',
      short_description: 'Premium black tea leaves',
      detailed_description: 'Handpicked organic black tea from the finest gardens of Sylhet.',
      price_per_unit: 450,
      unit_type: 'kg',
      available_stock: 50,
      category: 'tea',
      image_url: 'https://images.unsplash.com/photo-1576092762791-dd9e2220afa1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
    }
  });

  // Create Gur
  await prisma.products.create({
    data: {
      name: 'Khejur Gur (Date Palm Jaggery)',
      short_description: 'Pure winter delicacy',
      detailed_description: '100% pure date palm jaggery collected during the peak winter season.',
      price_per_unit: 250,
      unit_type: 'kg',
      available_stock: 100,
      category: 'gur',
      image_url: 'https://images.unsplash.com/photo-1604859664539-715bd7f05b4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
    }
  });

  // Create Announcement
  await prisma.site_announcements.create({
    data: {
      message: 'Pre-booking for Rajshahi Mangoes has started! Get 10% off on advance payment.',
      type: 'success',
      is_active: true
    }
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
