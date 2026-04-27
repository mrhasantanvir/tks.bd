const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding demo categories, units, and products...');

  // 1. Seed Units
  const kg = await prisma.units.upsert({ where: { name: 'KG' }, update: {}, create: { name: 'KG' } });
  const piece = await prisma.units.upsert({ where: { name: 'Piece' }, update: {}, create: { name: 'Piece' } });
  const litre = await prisma.units.upsert({ where: { name: 'Litre' }, update: {}, create: { name: 'Litre' } });

  // 2. Seed Categories
  const catMango = await prisma.categories.upsert({ 
    where: { slug: 'mango' }, 
    update: {}, 
    create: { name: 'Mango (আম)', slug: 'mango' } 
  });
  const catTea = await prisma.categories.upsert({ 
    where: { slug: 'tea' }, 
    update: {}, 
    create: { name: 'Premium Tea (চা)', slug: 'tea' } 
  });
  const catGur = await prisma.categories.upsert({ 
    where: { slug: 'gur-honey' }, 
    update: {}, 
    create: { name: 'Gur & Honey (গুড় ও মধু)', slug: 'gur-honey' } 
  });

  const couriers = ['Steadfast Logistics', 'Sundarban Courier', 'Pathao Courier', 'RedX Delivery'];

  // 3. Demo Products Data
  const productsData = [
    // --- Mangoes (10) ---
    { name: 'Rajshahi Himsagar Premium', catId: catMango.id, unitId: kg.id, price: 120, img: 'https://images.unsplash.com/photo-1553279768-865429fa0078' },
    { name: 'Langra Mango (Special Quality)', catId: catMango.id, unitId: kg.id, price: 100, img: 'https://images.unsplash.com/photo-1591073113125-e46713c829ed' },
    { name: 'Fazli Mango Large', catId: catMango.id, unitId: kg.id, price: 90, img: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae' },
    { name: 'Amrapali Mango Sweet', catId: catMango.id, unitId: kg.id, price: 110, img: 'https://images.unsplash.com/photo-1591073113125-e46713c829ed' },
    { name: 'Khirsapati Mango Rajshahi', catId: catMango.id, unitId: kg.id, price: 115, img: 'https://images.unsplash.com/photo-1553279768-865429fa0078' },
    { name: 'Gopalbhog Mango First Harvest', catId: catMango.id, unitId: kg.id, price: 130, img: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae' },
    { name: 'Ashwini Mango (Late Season)', catId: catMango.id, unitId: kg.id, price: 95, img: 'https://images.unsplash.com/photo-1553279768-865429fa0078' },
    { name: 'Lakhna Mango', catId: catMango.id, unitId: kg.id, price: 80, img: 'https://images.unsplash.com/photo-1591073113125-e46713c829ed' },
    { name: 'Surma Fazli Special', catId: catMango.id, unitId: kg.id, price: 105, img: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae' },
    { name: 'Harivanga Mango Rangpur', catId: catMango.id, unitId: kg.id, price: 125, img: 'https://images.unsplash.com/photo-1553279768-865429fa0078' },

    // --- Tea (10) ---
    { name: 'Sylhet Black Tea (Orange Pekoe)', catId: catTea.id, unitId: kg.id, price: 450, img: 'https://images.unsplash.com/photo-1594631252845-29fc458631b6' },
    { name: 'Premium Green Tea Leaves', catId: catTea.id, unitId: kg.id, price: 850, img: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9' },
    { name: 'Sreemangal Oolong Tea', catId: catTea.id, unitId: kg.id, price: 1200, img: 'https://images.unsplash.com/photo-1594631252845-29fc458631b6' },
    { name: 'Masala Tea Blend Box', catId: catTea.id, unitId: piece.id, price: 350, img: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9' },
    { name: 'White Tea (Rare Harvest)', catId: catTea.id, unitId: kg.id, price: 2500, img: 'https://images.unsplash.com/photo-1594631252845-29fc458631b6' },
    { name: 'CTC Tea Standard', catId: catTea.id, unitId: kg.id, price: 320, img: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9' },
    { name: 'Panchagarh Organic Black Tea', catId: catTea.id, unitId: kg.id, price: 550, img: 'https://images.unsplash.com/photo-1594631252845-29fc458631b6' },
    { name: 'Earl Grey Infusion', catId: catTea.id, unitId: kg.id, price: 950, img: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9' },
    { name: 'Jasmine Green Tea Premium', catId: catTea.id, unitId: kg.id, price: 1100, img: 'https://images.unsplash.com/photo-1594631252845-29fc458631b6' },
    { name: 'Assam Strong Blend', catId: catTea.id, unitId: kg.id, price: 400, img: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9' },

    // --- Gur & Honey (10) ---
    { name: 'Pure Mustard Flower Honey', catId: catGur.id, unitId: kg.id, price: 650, img: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38' },
    { name: 'Sundarban Multifloral Honey', catId: catGur.id, unitId: kg.id, price: 950, img: 'https://images.unsplash.com/photo-1558611848-73f7eb4001a1' },
    { name: 'Nolen Gur (Date Palm Syrup)', catId: catGur.id, unitId: kg.id, price: 350, img: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38' },
    { name: 'Patali Gur (Premium Block)', catId: catGur.id, unitId: kg.id, price: 400, img: 'https://images.unsplash.com/photo-1558611848-73f7eb4001a1' },
    { name: 'Black Seed Honey (Kalojira)', catId: catGur.id, unitId: kg.id, price: 1200, img: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38' },
    { name: 'Litchi Flower Honey Rajshahi', catId: catGur.id, unitId: kg.id, price: 700, img: 'https://images.unsplash.com/photo-1558611848-73f7eb4001a1' },
    { name: 'Sugarcane Gur (Organic)', catId: catGur.id, unitId: kg.id, price: 180, img: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38' },
    { name: 'Jhola Gur (Liquid Date Jaggery)', catId: catGur.id, unitId: kg.id, price: 450, img: 'https://images.unsplash.com/photo-1558611848-73f7eb4001a1' },
    { name: 'Cream Honey (Natural)', catId: catGur.id, unitId: kg.id, price: 1500, img: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38' },
    { name: 'Wild Forest Honey (Deep Jungle)', catId: catGur.id, unitId: kg.id, price: 1800, img: 'https://images.unsplash.com/photo-1558611848-73f7eb4001a1' },
  ];

  for (const p of productsData) {
    await prisma.products.create({
      data: {
        name: p.name,
        category_id: p.catId,
        unit_id: p.unitId,
        price_per_unit: p.price,
        available_stock: 500,
        lot_size: 1,
        packaging_charge: p.catId === catMango.id ? 150 : 50,
        image_url: p.img,
        available_couriers: JSON.stringify(couriers),
        short_description: `Premium quality ${p.name} directly from our organic farms.`,
        detailed_description: `Experience the authentic taste of our harvest. This ${p.name} is carefully collected and packaged with care. High quality, organic, and 100% natural.`,
        harvest_date: p.catId === catMango.id ? new Date('2026-05-15') : new Date('2026-04-20'),
        allow_home_delivery: true,
        allow_point_delivery: true,
        payment_policy: 'cod'
      }
    });
  }

  console.log('30 products seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
