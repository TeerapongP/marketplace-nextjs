import { PrismaClient } from '@prisma/client';

// Initialize Prisma Client
const prisma = new PrismaClient();

export async function seedSaleStalls(prisma: PrismaClient) {
  // Define the sale stalls to be seeded
  const saleStalls = [
    {
      Location: 'A1',
      Status: true,
      PricePerDay: 1000,
    },
    {
      Location: 'B2',
      Status: false,
      PricePerDay: 1500,
    },
    {
      Location: 'C3',
      Status: true,
      PricePerDay: 2000,
    },
  ];

  // Insert the sale stalls into the database
  for (const stall of saleStalls) {
    await prisma.saleStall.create({
      data: stall, // Directly pass the data object
    });
  }

  console.log('SaleStalls seeded successfully');
}

// Run the seed function
seedSaleStalls(prisma)
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
