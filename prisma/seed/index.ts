import { PrismaClient } from "@prisma/client";
import  seedUsers  from "./user-seed";
import { seedRoleMenus } from "./role-menu-seed";
import { seedCarts } from "./cart-seed";
import { seedProducts } from "./product-seed";
import { seedOrders } from "./order-seed";
import { seedSaleStalls } from "./sale-stall-seed";
import { seedStallReservations } from "./stall-reservation-seed";
import { seedMenus } from "./menu-seed";

// Initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding data...");

  // Call seed functions
  await seedUsers(prisma);
  await seedRoleMenus(prisma);
  await seedCarts(prisma);
  await seedProducts(prisma);
  await seedOrders(prisma);
  await seedSaleStalls(prisma);
  await seedStallReservations(prisma);
  await seedMenus(prisma);

  console.log("Seeding completed successfully!");
}

// Run the main function
main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
