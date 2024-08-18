import { PrismaClient } from "@prisma/client";
import seedUsers from "./user-seed";
import seedRoles from "./role-seed";
import seedProducts from "./product-seed";
import seedCarts from "./cart-seed";
import seedSaleStalls from "./sale-stall-seed";
import seedStallReservations from "./stall-reservation-seed";
import seedMenus from "./menu-seed";
import seedOrders from "./order-seed";
import seedCartItems from "./cart-item-seed";
import seedRoleMenus from "./role-menu-seed";
import clearExistingData from "./clearExistingData";

// Initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding data...");

  await clearExistingData(prisma);
  await seedUsers(prisma);
  await seedRoles(prisma); // Ensure roles are seeded after users
  await seedProducts(prisma);
  await seedCarts(prisma);
  await seedSaleStalls(prisma);
  await seedStallReservations(prisma);
  await seedMenus(prisma);
  await seedOrders(prisma);
  await seedCartItems(prisma);
  await seedRoleMenus(prisma);

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
