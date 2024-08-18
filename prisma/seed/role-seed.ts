import { PrismaClient } from "@prisma/client";

const seedRoles = async (prisma: PrismaClient) => {
  console.log("Seeding role data...");

  try {
    await prisma.role.createMany({
      data: [
        {
          RoleName: 'User',
          Description: 'Regular user with basic access rights',
          UserID: 1,
        },
        {
          RoleName: 'Merchant',
          Description: 'Seller or shop owner with permissions to manage their products and orders',
          UserID: 2,
        },
        {
          RoleName: 'Market Owner',
          Description: 'Market owner with permissions to manage multiple merchants and overall market settings',
          UserID: 3,
        }
      ],
    });

    console.log("Roles seeded successfully!");
  } catch (error:any) {
    if (error.code === "P2002") {
      console.error("Unique constraint violation occurred during seeding.");
    } else if (error.code === "P2003") {
      console.error("Foreign key constraint violation occurred during seeding.");
    } else {
      console.error("Error during seeding:", error);
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

export default seedRoles;
