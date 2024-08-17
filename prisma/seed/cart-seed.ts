import { PrismaClient } from '@prisma/client';

// Initialize Prisma Client
const prisma = new PrismaClient();

export async function seedCarts(prisma: PrismaClient) {
  // Define the cart data to be seeded
  const carts = [
    {
      UserID: 1, // Replace with actual User IDs from your database
      CreatedDate: new Date(),
      UpdatedDate: new Date()
    },
    {
      UserID: 2,
      CreatedDate: new Date(),
      UpdatedDate: new Date()
    },
    // Add more cart entries as needed
  ];

  // Insert the cart data into the database
  for (const cart of carts) {
    await prisma.cart.create({
      data: cart
    });
  }

  console.log('Carts seeded successfully');
}

// Run the seed function
seedCarts(prisma)
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
