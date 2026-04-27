const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const https = require('https');

async function fetchData(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', (e) => reject(e));
  });
}

async function main() {
  console.log("Fetching districts from bdapis.com...");
  try {
    const districtRes = await fetchData('https://bdapis.com/api/v1.2/districts');
    const districts = districtRes.data;

    for (const d of districts) {
      console.log(`Processing District: ${d.district}...`);
      
      // Create District
      const dbDistrict = await prisma.districts.upsert({
        where: { name: d.district },
        update: {},
        create: {
          name: d.district,
          is_dhaka: d.district.toLowerCase() === 'dhaka'
        }
      });

      // Fetch Upazilas for this district
      const upazilaRes = await fetchData(`https://bdapis.com/api/v1.2/district/${d.district}`);
      const upazilas = upazilaRes.data[0].upazillas;

      for (const u of upazilas) {
        await prisma.upazilas.create({
          data: {
            name: u,
            district_id: dbDistrict.id
          }
        });
      }
    }
    console.log("Successfully imported all districts and upazilas!");
  } catch (error) {
    console.error("Error importing locations:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
