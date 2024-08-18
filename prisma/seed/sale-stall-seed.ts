
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const seedSaleStalls = async (prisma: PrismaClient) => {
  console.log("Seeding seedRoleMenus data...");

  try {
    await prisma.saleStall.createMany({
      data: [
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

export default seedSaleStalls;

