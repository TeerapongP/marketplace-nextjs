import { PrismaClient } from "@prisma/client";

export async function seedCartItems(prisma: PrismaClient) {
  const cartItems = [
    {
      CartID: 1, // Replace with actual Cart IDs from your database
      ProductID: 1, // Replace with actual Product IDs from your database
      Quantity: 2,
      UserID: 1, // Replace with actual User IDs from your database
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
  ];

  for (const item of cartItems) {
    await prisma.cartItem.create({
      data: item,
    });
  }

  console.log("CartItems seeded successfully");
}
