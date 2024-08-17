import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface OrderData {
  CustomerId: number;
  StoreId: number;
  OrderDate: Date;
  Status: boolean;
  TotalAmount: bigint; // Use bigint for BigInt values
  PaymentMethod: string;
  ShippingAddress: string;
  TrackingNumber: string;
}

export async function seedOrders(prisma: PrismaClient) {
  // Define the order data to be seeded
  const orders: any[] = [
    {
      CustomerId: 1,  // Assuming a user with ID 1 exists
      StoreId: 1,     // Assuming a store with ID 1 exists
      OrderDate: new Date(),
      Status: true,
      TotalAmount: BigInt(5000),  // BigInt for TotalAmount
      PaymentMethod: 'Credit Card',
      ShippingAddress: '123 Main St, Anytown, USA',
      TrackingNumber: 'TRACK123456789'
    },
    {
      CustomerId: 2,  // Assuming a user with ID 2 exists
      StoreId: 2,     // Assuming a store with ID 2 exists
      OrderDate: new Date(),
      Status: false,
      TotalAmount: BigInt(1500),  // BigInt for TotalAmount
      PaymentMethod: 'PayPal',
      ShippingAddress: '456 Elm St, Othertown, USA',
      TrackingNumber: 'TRACK987654321'
    },
    // Add more orders as needed
  ];

  // Insert the order data into the database
  for (const order of orders) {
    await prisma.order.create({
      data: order
    });
  }

  console.log('Orders seeded successfully');
}

// Run the seed function
seedOrders(prisma)
  .catch(e => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
