import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const seedCartItems = async (prisma: PrismaClient) => {
  console.log('Seeding cartItem data...');

  try {
    await prisma.cartItem.createMany({
      data: [
        {
          CartID: 1,      // Replace with actual Cart IDs from your database
          ProductID: 1,   // Replace with actual Product IDs from your database
          Quantity: 2,
          UserID: 1,      // Replace with actual User IDs from your database
        },
        {
          CartID: 1,
          ProductID: 2,
          Quantity: 1,
          UserID: 1,
        },
        {
          CartID: 2,
          ProductID: 3,
          Quantity: 5,
          UserID: 2,
        },
        // Add more entries as needed
      ],
    });

    console.log('CartItem data seeded successfully!');
  } catch (error: any) {
    if (error.code === 'P2002') {
      console.error('Unique constraint violation occurred during seeding.');
    } else if (error.code === 'P2003') {
      console.error('Foreign key constraint violation occurred during seeding.');
    } else {
      console.error('Error during seeding:', error);
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

export default seedCartItems;
