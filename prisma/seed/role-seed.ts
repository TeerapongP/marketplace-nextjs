import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const seedRoles = async (prisma: PrismaClient) => {
  // Example user ID (replace with actual ID)
  const roles = [
    {
      RoleName: 'User',
      Description: 'Regular user with basic access rights',
      userId: 1,
    },
    {
      RoleName: 'Merchant',
      Description: 'Seller or shop owner with permissions to manage their products and orders',
      userId: 2,
    },
    {
      RoleName: 'Market Owner',
      Description: 'Market owner with permissions to manage multiple merchants and overall market settings',
      userId: 3,
    }
  ];

  for (const role of roles) {
    await prisma.role.create({
      data: {
        RoleName: role.RoleName,
        Description: role.Description,
        user: { connect: { ID: role.userId } },
      }
    });
  }

  console.log('Roles seeded successfully');
}

module.exports = seedRoles;
