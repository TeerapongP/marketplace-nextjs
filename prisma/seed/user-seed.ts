import { PrismaClient } from "@prisma/client";

const checkUsers = async (prisma: PrismaClient) => {
  const users = await prisma.user.findMany();
  console.log("Existing users:", users);
};

const seedUsers = async (prisma: PrismaClient) => {
  console.log("Seeding user data...");

  try {
    await prisma.user.createMany({
      data: [
        {
          Username: 'user1',
          PasswordHash: 'hashedpassword1',
          FirstName: 'First1',
          LastName: 'Last1',
          Email: 'user1@example.com',
          PhoneNumber: '1234567890',
          Address: 'Address 1',
          ProfileImage: 'profile1.jpg'
        },
        {
          Username: 'user2',
          PasswordHash: 'hashedpassword2',
          FirstName: 'First2',
          LastName: 'Last2',
          Email: 'user2@example.com',
          PhoneNumber: '1234567891',
          Address: 'Address 2',
          ProfileImage: 'profile2.jpg'
        },
        {
          Username: 'user3',
          PasswordHash: 'hashedpassword3',
          FirstName: 'First3',
          LastName: 'Last3',
          Email: 'user3@example.com',
          PhoneNumber: '1234567892',
          Address: 'Address 3',
          ProfileImage: 'profile3.jpg'
        }
      ]
    });

    console.log("User data seeded successfully!");
  } catch (error) {
    console.error("Error during seeding user data:", error);
    process.exit(1);
  }
};

export default seedUsers;
