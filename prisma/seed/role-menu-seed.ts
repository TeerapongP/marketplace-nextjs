import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedRoleMenus(prisma: PrismaClient) {
  console.log('Seeding role-menu data...');

  const roleMenus = [
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
    // Add more role-menu associations as needed
  ];

  try {
    for (const roleMenu of roleMenus) {
      await prisma.roleMenu.create({
        data: roleMenu,
      });
    }
    console.log('RoleMenu seeded successfully');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await prisma.$disconnect();
  }
}

