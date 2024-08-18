import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const seedStallReservations = async (prisma: PrismaClient) => {
  console.log("Seeding seedRoleMenus data...");

  try {
    await prisma.stallReservation.createMany({
      data: [
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
      ],
    });

    console.log("data seeded successfully!");
  } catch (error: any) {
    if (error.code === "P2002") {
      console.error("Unique constraint violation occurred during seeding.");
    } else if (error.code === "P2003") {
      console.error(
        "Foreign key constraint violation occurred during seeding."
      );
    } else {
      console.error("Error during seeding:", error);
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

export default seedStallReservations;
