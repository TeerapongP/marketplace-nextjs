import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const seedRoles = async (prisma: PrismaClient) => {
  // Example user ID (replace with actual ID)
  const exampleUserId = 1;

  const roles = [
    {
      RoleName: 'User',
      Description: 'Regular user with basic access rights',
      userId: exampleUserId,
    },
    {
      RoleName: 'Merchant',
      Description: 'Seller or shop owner with permissions to manage their products and orders',
      userId: exampleUserId,
    },
    {
      RoleName: 'Market Owner',
      Description: 'Market owner with permissions to manage multiple merchants and overall market settings',
      userId: exampleUserId,
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
