import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const seedRoleMenus = async (prisma: PrismaClient) => {
  console.log("Seeding seedRoleMenus data...");

  try {
    await prisma.roleMenu.createMany({
      data: [
        {
          RoleID: 1,
          MenuID: 1,
          CanAccess: true,
        },
        {
          RoleID: 1,
          MenuID: 2,
          CanAccess: false,
        },
        {
          RoleID: 2,
          MenuID: 1,
          CanAccess: true,
        },
        {
          RoleID: 2,
          MenuID: 3,
          CanAccess: true,
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

export default seedRoleMenus;
