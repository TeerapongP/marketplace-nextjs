import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const seedProducts = async (prisma: PrismaClient) => {
  console.log("Seeding seedRoleMenus data...");

  try {
    await prisma.product.createMany({
      data: [
        {
          ProductName: "Product A",
          Price: 1000, // Regular number
          Description: "Description for Product A",
          StoreID: 1, // Assuming a store with ID 1 exists
          ProductImage: "https://example.com/imageA.jpg",
        },
        {
          ProductName: "Product B",
          Price: 2000, // Regular number
          Description: "Description for Product B",
          StoreID: 2, // Assuming a store with ID 2 exists
          ProductImage: "https://example.com/imageB.jpg",
        },
        {
          ProductName: "Product C",
          Price: 3000, // Regular number
          Description: "Description for Product C",
          StoreID: 1, // Assuming a store with ID 1 exists
          ProductImage: "https://example.com/imageC.jpg",
        },
      ],
    });

    console.log("data seeded successfully!");
  } catch (error: any) {
    if (error.code === "P2002") {
      console.error("Unique constraint violation occurred during seeding.");
    } else if (error.code === "P2003") {
      console.error(
        "Foreign key constraint violation occurred during seeding."
      );
    } else {
      console.error("Error during seeding:", error);
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

export default seedProducts;
