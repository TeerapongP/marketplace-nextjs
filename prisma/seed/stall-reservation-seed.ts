import { PrismaClient } from '@prisma/client';

// Initialize Prisma Client
const prisma = new PrismaClient();

export async function seedStallReservations(prisma: PrismaClient) {
  // Define the stall reservations to be seeded
  const stallReservations = [
    {
      StoreID: 1, // Ensure these IDs exist in your Store model
      UserID: 1, // Ensure these IDs exist in your User model
      ReservationDate: new Date("2024-09-01T00:00:00Z"),
      Status: true,
      SaleStallID: 1, // Ensure these IDs exist in your SaleStall model
    },
    {
      StoreID: 2,
      UserID: 2,
      ReservationDate: new Date("2024-09-15T00:00:00Z"),
      Status: false,
      SaleStallID: 2,
    },
    {
      StoreID: 3,
      UserID: 3,
      ReservationDate: new Date("2024-10-01T00:00:00Z"),
      Status: true,
      SaleStallID: 3,
    },
  ];

  // Insert the stall reservations into the database
  for (const reservation of stallReservations) {
    await prisma.stallReservation.create({
      data: reservation,
    });
  }

  console.log("StallReservations seeded successfully");
}

// Run the seed function
seedStallReservations(prisma)
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
