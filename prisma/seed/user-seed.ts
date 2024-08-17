import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const seedUsers = async (prisma: PrismaClient) => {
  console.log('Seeding user data...');

  try {
    await prisma.user.createMany({
      data: [
        {
          Username: 'john_doe',
          PasswordHash: 'hashed_password_123',
          FirstName: 'John',
          LastName: 'Doe',
          Email: 'john.doe@example.com',
          PhoneNumber: '555-1234',
          Address: '123 Main St, Anytown, USA',
          ProfileImage: 'http://example.com/profile/john_doe.jpg',
        },
        {
          Username: 'jane_smith',
          PasswordHash: 'hashed_password_456',
          FirstName: 'Jane',
          LastName: 'Smith',
          Email: 'jane.smith@example.com',
          PhoneNumber: '555-5678',
          Address: '456 Elm St, Anytown, USA',
          ProfileImage: 'http://example.com/profile/jane_smith.jpg',
        },
      ],
    });

    console.log('User data seeded successfully!');
  } catch (error:any) {
    if (error.code === 'P2002') {
      console.error('Unique constraint violation occurred during seeding.');
    } else {
      console.error('Error during seeding:', error);
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

export default seedUsers;
