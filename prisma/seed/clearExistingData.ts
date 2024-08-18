import { PrismaClient } from "@prisma/client";

const clearExistingData = async (prisma: PrismaClient) => {
  console.log("Clearing existing data...");

  try {
    // Delete records from tables with foreign key dependencies first
    await prisma.cartItem.deleteMany({});
    await prisma.cart.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.stallReservation.deleteMany({});
    await prisma.saleStall.deleteMany({});
    await prisma.product.deleteMany({});

    // Now delete roles and menu items (dependent on User)
    await prisma.roleMenu.deleteMany({});
    await prisma.role.deleteMany({});

    // Finally, delete users and stores (parent records)
    await prisma.user.deleteMany({});
    await prisma.store.deleteMany({});
    await prisma.menu.deleteMany({});

    console.log("Existing data cleared successfully!");
  } catch (error) {
    console.error("Error during data clearing:", error);
    process.exit(1);
  }
};

export default clearExistingData;
