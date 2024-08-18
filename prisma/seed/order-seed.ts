import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const seedOrders = async (prisma: PrismaClient) => {
  console.log('Seeding order data...');

  try {
    await prisma.order.createMany({
      data: [
        {
          CustomerId: 1,  // Assuming this customer exists
          StoreId: 1,     // Assuming this store exists
          OrderDate: new Date(),
          Status: true,
          TotalAmount: BigInt(5000),  // Using BigInt for large numbers
          PaymentMethod: 'Credit Card',
          ShippingAddress: '123 Main St, Anytown, USA',
          TrackingNumber: 'TRACK123456789',
        },
        {
          CustomerId: 2,  // Assuming this customer exists
          StoreId: 2,     // Assuming this store exists
          OrderDate: new Date(),
          Status: false,
          TotalAmount: BigInt(1500),  // Using BigInt for large numbers
          PaymentMethod: 'PayPal',
          ShippingAddress: '456 Elm St, Othertown, USA',
          TrackingNumber: 'TRACK987654321',
        },
        // Add more orders as needed
      ],
    });

    console.log('Order data seeded successfully!');
  } catch (error: any) {
    if (error.code === 'P2002') {
      console.error('Unique constraint violation occurred during seeding.');
    } else if (error.code === 'P2003') {
      console.error('Foreign key constraint violation occurred during seeding.');
    } else {
      console.error('Error during seeding:', error);
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

export default seedOrders;
