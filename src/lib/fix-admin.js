const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const user = await prisma.users.update({
    where: { mobile_number: '01919999927' },
    data: { role: 'admin' }
  });
  console.log('Verification: User', user.mobile_number, 'role is', user.role);
}
main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
