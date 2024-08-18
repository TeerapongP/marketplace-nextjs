import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const seedMenus = async (prisma: PrismaClient) => {
  console.log("Seeding seedRoleMenus data...");

  try {
    await prisma.menu.createMany({
      data: [
        {
                MenuName: 'Dashboard',
                ParentMenu: 'Main',
                URL: '/dashboard',
              },
              {
                MenuName: 'Users',
                ParentMenu: 'Management',
                URL: '/users',
              },
              {
                MenuName: 'Products',
                ParentMenu: 'Catalog',
                URL: '/products',
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

export default seedMenus;
