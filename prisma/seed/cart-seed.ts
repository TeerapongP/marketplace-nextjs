import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const seedCarts = async (prisma: PrismaClient) => {
  console.log("Seeding seedRoleMenus data...");

  try {
    await prisma.cart.createMany({
      data: [
        {
          UserID: 1, // Replace with actual User IDs from your database
          CreatedDate: new Date(),
          UpdatedDate: new Date(),
        },
        {
          UserID: 2, // Replace with actual User IDs from your database
          CreatedDate: new Date(),
          UpdatedDate: new Date(),
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

export default seedCarts;