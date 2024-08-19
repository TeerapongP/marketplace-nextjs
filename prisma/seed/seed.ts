import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    // Create Roles
    const adminRole = await prisma.role.create({
        data: {
            roleName: "Admin",
        },
    });

    const userRole = await prisma.role.create({
        data: {
            roleName: "User",
        },
    });

    // Create Categories
    const electronicsCategory = await prisma.category.create({
        data: {
            name: "Electronics",
        },
    });

    const clothingCategory = await prisma.category.create({
        data: {
            name: "Clothing",
        },
    });

    // Create Products
    const phoneProduct = await prisma.product.create({
        data: {
            description: "Smartphone",
            price: 699.99,
            stock: 50,
            category: {
                connect: { categoryId: electronicsCategory.categoryId },
            },
        },
    });

    const shirtProduct = await prisma.product.create({
        data: {
            description: "T-shirt",
            price: 19.99,
            stock: 100,
            category: {
                connect: { categoryId: clothingCategory.categoryId },
            },
        },
    });

    // Create Users
    const adminUser = await prisma.user.create({
        data: {
            userName: "admin",
            password: "admin123",
            firstName: "Admin",
            lastName: "User",
            email: "admin@example.com",
            phoneNumber: "1234567890",
            address: "123 Admin St",
            role: {
                connect: { roleId: adminRole.roleId },
            },
        },
    });

    const normalUser = await prisma.user.create({
        data: {
            userName: "user",
            password: "user123",
            firstName: "Normal",
            lastName: "User",
            email: "user@example.com",
            phoneNumber: "0987654321",
            address: "456 User Ave",
            role: {
                connect: { roleId: userRole.roleId },
            },
        },
    });

    // Create Orders with OrderItems
    const order = await prisma.order.create({
        data: {
            orderDate: new Date(),
            totalPrice: 719.98,
            user: {
                connect: { userId: normalUser.userId },
            },
            orderItems: {
                create: [
                    {
                        orderDate: new Date(),
                        totalPrice: 699.99,
                        product: {
                            connect: { productId: phoneProduct.productId },
                        },
                    },
                    {
                        orderDate: new Date(),
                        totalPrice: 19.99,
                        product: {
                            connect: { productId: shirtProduct.productId },
                        },
                    },
                ],
            },
        },
    });

    console.log("Seed data inserted");
}

main()
    .catch((e) => {
        throw e;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
