import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedProducts(prisma: PrismaClient) {
  // Define the product data to be seeded
  const products: any[] = [
    {
      ProductName: 'Product A',
      Price: 1000,  // Regular number
      Description: 'Description for Product A',
      StoreID: 1,    // Assuming a store with ID 1 exists
      ProductImage: 'https://example.com/imageA.jpg'
    },
    {
      ProductName: 'Product B',
      Price: 2000,  // Regular number
      Description: 'Description for Product B',
      StoreID: 2,    // Assuming a store with ID 2 exists
      ProductImage: 'https://example.com/imageB.jpg'
    },
    {
      ProductName: 'Product C',
      Price: 3000,  // Regular number
      Description: 'Description for Product C',
      StoreID: 1,    // Assuming a store with ID 1 exists
      ProductImage: 'https://example.com/imageC.jpg'
    },
    // Add more products as needed
  ];

  // Insert the product data into the database
  for (const product of products) {
    await prisma.product.create({
      data: product
    });
  }

  console.log('Products seeded successfully');
}

// Run the seed function
seedProducts(prisma)
  .catch(e => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
