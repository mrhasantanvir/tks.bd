const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const count = await prisma.products.count();
  console.log('Current product count:', count);

  if (count === 0) {
    console.log('Seeding demo products...');
    const demoProducts = [
      { name: 'Rajshahi Himsagar', category: 'mango', price_per_unit: 1200, lot_size: 12, available_stock: 500, image_url: 'https://images.unsplash.com/photo-1553134834-40673d324be8?auto=format&fit=crop&q=80&w=400', is_preorder: true, unit_type: 'kg', payment_policy: 'cod' },
      { name: 'Premium Langra Mango', category: 'mango', price_per_unit: 1100, lot_size: 12, available_stock: 0, image_url: 'https://images.unsplash.com/photo-1591073113125-e46713c829ed?auto=format&fit=crop&q=80&w=400', is_preorder: true, unit_type: 'kg', payment_policy: 'cod' },
      { name: 'Amrapali Mango Special', category: 'mango', price_per_unit: 1350, lot_size: 15, available_stock: 300, image_url: 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&q=80&w=400', is_preorder: true, unit_type: 'kg', payment_policy: 'cod' },
      { name: 'First Flush Black Tea', category: 'tea', price_per_unit: 450, lot_size: 1, available_stock: 100, image_url: 'https://images.unsplash.com/photo-1594631252845-29fc458695d1?auto=format&fit=crop&q=80&w=400', is_preorder: false, unit_type: 'kg', payment_policy: 'cod' },
      { name: 'Organic Green Tea Leaf', category: 'tea', price_per_unit: 600, lot_size: 1, available_stock: 50, image_url: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&q=80&w=400', is_preorder: false, unit_type: 'kg', payment_policy: 'cod' },
      { name: 'Pure Khejur Gur (Nolen)', category: 'gur', price_per_unit: 350, lot_size: 1, available_stock: 200, image_url: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&q=80&w=400', is_preorder: false, unit_type: 'kg', payment_policy: 'cod' },
      { name: 'Premium Patali Gur', category: 'gur', price_per_unit: 280, lot_size: 1, available_stock: 150, image_url: 'https://images.unsplash.com/photo-1589113103553-611dfd9a0d1e?auto=format&fit=crop&q=80&w=400', is_preorder: false, unit_type: 'kg', payment_policy: 'cod' }
    ];

    for (const p of demoProducts) {
      await prisma.products.create({ data: p });
    }
    console.log('Seeding complete.');
  } else {
    console.log('Products already exist. Total:', count);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
