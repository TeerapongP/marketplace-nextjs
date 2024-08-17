import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedMenus(prisma: PrismaClient) {
  // Define the menu data to be seeded
  const menus = [
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
    // Add more menu entries as needed
  ];

  // Insert the menu data into the database
  for (const menu of menus) {
    await prisma.menu.create({
      data: menu,
    });
  }

  console.log('Menus seeded successfully');
}

// Run the seed function
seedMenus(prisma)
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
