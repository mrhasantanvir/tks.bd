const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding products, categories, and units...');

  // 1. Setup Categories (Matching slugs with homepage queries)
  const mangoCat = await prisma.categories.upsert({
    where: { slug: 'mango' },
    update: {},
    create: { name: 'Mango', slug: 'mango' }
  });

  const teaCat = await prisma.categories.upsert({
    where: { slug: 'tea' },
    update: {},
    create: { name: 'Tea', slug: 'tea' }
  });

  const gurCat = await prisma.categories.upsert({
    where: { slug: 'gur' },
    update: {},
    create: { name: 'Honey & Gur', slug: 'gur' }
  });

  // 2. Setup Units
  const kgUnit = await prisma.units.upsert({
    where: { name: 'kg' },
    update: {},
    create: { name: 'kg' }
  });

  const gmUnit = await prisma.units.upsert({
    where: { name: 'gm' },
    update: {},
    create: { name: 'gm' }
  });

  // 3. Setup Admin User
  await prisma.users.upsert({
    where: { mobile_number: '01700000000' },
    update: { role: 'admin' },
    create: { mobile_number: '01700000000', full_name: 'Admin User', role: 'admin', is_verified: true }
  });

  // 4. Setup Site Announcements
  await prisma.site_announcements.deleteMany({});
  await prisma.site_announcements.create({
    data: { message: "স্বাগতম TKS.bd-এ! নতুন মৌসুমের সেরা আম ও খাঁটি পণ্য পেতে অর্ডার করুন।", type: "info" }
  });

  // 5. Insert 30 Products
  console.log('Clearing old products...');
  await prisma.products.deleteMany({});

  const mangoNames = ['Himsagar', 'Langra', 'Fazli', 'Amrapali', 'Gopalbhog', 'Haribhanga', 'Khirsapat', 'Lakhna', 'Mohanbhog', 'Surma Fazli'];
  for (let i = 0; i < 10; i++) {
    await prisma.products.create({
      data: {
        name: `Premium ${mangoNames[i]} Mango`,
        short_description: `${mangoNames[i]} Mango directly from Rajshahi orchards.`,
        detailed_description: "Enjoy the sweet and juicy Rajshahi mangoes. 100% organic and chemical-free.",
        price_per_unit: 120 + (i * 10),
        available_stock: 500,
        category_id: mangoCat.id,
        unit_id: kgUnit.id,
        image_url: `https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=500&q=60`,
        is_preorder: true,
        harvest_date: new Date("2026-05-15")
      }
    });
  }

  const teaNames = ['Panchagarh Black Tea', 'Sylhet Green Tea', 'Organic Oolong', 'Lemon Infusion', 'Masala Chai Blend', 'Silver Needle White', 'Strong CTC Tea', 'Dust Tea Premium', 'Golden Flowery Orange Pekoe', 'Flowery Broken Orange Pekoe'];
  for (let i = 0; i < 10; i++) {
    await prisma.products.create({
      data: {
        name: teaNames[i],
        short_description: `Finest ${teaNames[i]} from the hills of Bangladesh.`,
        detailed_description: "Expertly picked and processed tea leaves for the perfect cup.",
        price_per_unit: 450 + (i * 50),
        available_stock: 100,
        category_id: teaCat.id,
        unit_id: gmUnit.id,
        lot_size: 500,
        image_url: "https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?auto=format&fit=crop&w=500&q=60",
        is_preorder: false
      }
    });
  }

  const honeyNames = ['Sundarban Khalisha Honey', 'Litchi Flower Honey', 'Black Seed (Kalo Jira) Honey', 'Mustard Flower Honey', 'Wild Multi-flower Honey', 'Premium Date Molasses (Gur)', 'Nolen Gur Solid', 'Liquid Khejur Gur', 'Sugarcane Molasses', 'Organic Honeycomb'];
  for (let i = 0; i < 10; i++) {
    await prisma.products.create({
      data: {
        name: honeyNames[i],
        short_description: `Pure and authentic ${honeyNames[i]}.`,
        detailed_description: "Ethically sourced and tested for purity. Traditional taste of Bengal.",
        price_per_unit: 600 + (i * 100),
        available_stock: 50,
        category_id: gurCat.id,
        unit_id: kgUnit.id,
        image_url: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=500&q=60",
        is_preorder: false
      }
    });
  }

  console.log('✅ Seeding completed successfully with correct slugs (mango, tea, gur)!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
