import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedStores(prisma: PrismaClient) {
  // Define the store data to be seeded
  const stores = [
    {
      StoreName: 'Store A',
      Status: true,
      OwnerID: 1,  // Ensure this ID exists in your User model
      StoreImage: 'https://example.com/imageA.jpg',
      DetailStore: 'Details about Store A',
    },
    {
      StoreName: 'Store B',
      Status: false,
      OwnerID: 2,  // Ensure this ID exists in your User model
      StoreImage: 'https://example.com/imageB.jpg',
      DetailStore: 'Details about Store B',
    },
    {
      StoreName: 'Store C',
      Status: true,
      OwnerID: 3,  // Ensure this ID exists in your User model
      StoreImage: 'https://example.com/imageC.jpg',
      DetailStore: 'Details about Store C',
    },
  ];

  // Insert the store data into the database
  for (const store of stores) {
    await prisma.store.create({
      data: store,
    });
  }

  console.log('Stores seeded successfully');
}

// Run the seed function
seedStores(prisma)
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
