const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding 30 products and setting up Admin user...');

  // 1. Create/Update Admin User
  const adminMobile = '01700000000';
  await prisma.users.upsert({
    where: { mobile_number: adminMobile },
    update: {
      role: 'admin',
      is_verified: true,
      full_name: 'System Admin'
    },
    create: {
      mobile_number: adminMobile,
      full_name: 'System Admin',
      role: 'admin',
      is_verified: true,
    }
  });
  console.log('Admin user verified/created (01700000000).');

  // Clear existing dummy products
  await prisma.products.deleteMany();
  console.log('Cleared existing products.');

  const mangoImages = [
    'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=500&q=60',
    'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?auto=format&fit=crop&w=500&q=60',
    'https://images.unsplash.com/photo-1591073113125-e46713c829ed?auto=format&fit=crop&w=500&q=60'
  ];
  const teaImages = [
    'https://images.unsplash.com/photo-1576092762791-dd9e2220afa1?auto=format&fit=crop&w=500&q=60',
    'https://images.unsplash.com/photo-1594631252845-29fc4cc8cbf9?auto=format&fit=crop&w=500&q=60',
    'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&w=500&q=60'
  ];
  const gurImages = [
    'https://images.unsplash.com/photo-1604859664539-715bd7f05b4b?auto=format&fit=crop&w=500&q=60',
    'https://images.unsplash.com/photo-1582236906232-23c4a250dcbd?auto=format&fit=crop&w=500&q=60'
  ];

  // 2. Insert 10 Mangoes
  const mangoNames = ['Himsagar', 'Langra', 'Fazli', 'Amrapali', 'Gopalbhog', 'Haribhanga', 'Khirsapat', 'Lakhna', 'Mohanbhog', 'Surma Fazli'];
  for (let i = 0; i < 10; i++) {
    await prisma.products.create({
      data: {
        name: `Premium ${mangoNames[i]} Mango`,
        short_description: `Fresh ${mangoNames[i]} directly from Rajshahi orchards.`,
        detailed_description: `Enjoy the sweet and juicy ${mangoNames[i]} mango. 100% organic and chemical-free, handpicked from our best orchards.`,
        price_per_unit: 100 + (Math.random() * 50).toFixed(0),
        unit_type: 'kg',
        available_stock: 500,
        category: 'mango',
        image_url: mangoImages[i % mangoImages.length],
        is_preorder: i % 3 === 0,
        harvest_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
      }
    });
  }

  // 3. Insert 10 Teas
  const teaNames = ['Sylhet Black', 'Green Organic', 'Oolong Reserve', 'White Pearl', 'Mint Blend', 'Jasmine Bloom', 'Earl Grey Classic', 'Assam Strong', 'Darjeeling First Flush', 'Spiced Masala'];
  for (let i = 0; i < 10; i++) {
    await prisma.products.create({
      data: {
        name: `${teaNames[i]} Tea`,
        short_description: `Aromatic ${teaNames[i]} leaves.`,
        detailed_description: `Sourced from the premium gardens of Sylhet. The ${teaNames[i]} tea offers a rich, soothing experience.`,
        price_per_unit: 400 + (Math.random() * 300).toFixed(0),
        unit_type: 'kg',
        available_stock: 100,
        category: 'tea',
        image_url: teaImages[i % teaImages.length],
      }
    });
  }

  // 4. Insert 10 Gurs
  const gurNames = ['Nolen Gur', 'Khejur Gur Solid', 'Khejur Gur Liquid', 'Tal Gur', 'Akher Gur (Sugarcane)', 'Patali Gur', 'Jhola Gur', 'Organic Honey Gur', 'Special Winter Gur', 'Premium Rajshahi Gur'];
  for (let i = 0; i < 10; i++) {
    await prisma.products.create({
      data: {
        name: `${gurNames[i]}`,
        short_description: `Traditional ${gurNames[i]} for authentic taste.`,
        detailed_description: `Experience the rich, earthy sweetness of ${gurNames[i]}. Perfect for making traditional winter pithas and sweets.`,
        price_per_unit: 200 + (Math.random() * 100).toFixed(0),
        unit_type: 'kg',
        available_stock: 200,
        category: 'gur',
        image_url: gurImages[i % gurImages.length],
      }
    });
  }

  console.log('Seeded 30 products successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
