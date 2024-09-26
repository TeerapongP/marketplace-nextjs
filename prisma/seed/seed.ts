import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create bakery products
  await prisma.product.createMany({
    data: [
      {
        productName: "ครัวซองต์",
        description:
          "ครัวซองต์เป็นขนมปังอบกรอบจากฝรั่งเศสที่มีลักษณะเป็นชั้นๆ รสชาติหวานและเนย มีเนื้อสัมผัสที่กรอบนอกนุ่มใน สามารถรับประทานได้ทั้งแบบเปล่าๆ หรือใส่แยมและเนยเพิ่มเติม",
        price: 75,
        stock: 30,
        images: "https://www.bakery.com/images/croissant.jpg",
        categoryId: 2, // Replace with actual categoryId for bakery
        shopId: 5,
      },
      {
        productName: "เค้กช็อคโกแลต",
        description:
          "เค้กช็อคโกแลตเป็นเค้กที่มีรสชาติเข้มข้นจากช็อคโกแลตที่ใช้ในการอบ อาจจะมีการตกแต่งด้วยครีมหรือช็อคโกแลตเพิ่มเติมเพื่อเพิ่มรสชาติและความสวยงาม",
        price: 250,
        stock: 15,
        images: "https://www.bakery.com/images/chocolate-cake.jpg",
        categoryId: 2, // Replace with actual categoryId for bakery
        shopId: 5,
      },
      {
        productName: "แพนเค้ก",
        description:
          "แพนเค้กเป็นขนมอบที่ทำจากแป้งและนม บางครั้งจะมีการใส่ผลไม้สดหรือช็อคโกแลตชิพลงไปด้วย รสชาติอ่อนหวานและเนื้อสัมผัสนุ่ม",
        price: 85,
        stock: 20,
        images: "https://www.bakery.com/images/pancake.jpg",
        categoryId: 2, // Replace with actual categoryId for bakery
        shopId: 5,
      },
      {
        productName: "มัฟฟินบลูเบอรี",
        description:
          "มัฟฟินบลูเบอรีเป็นขนมปังอบที่มีส่วนผสมของบลูเบอรีสดหรือแช่แข็ง ซึ่งทำให้มีรสชาติเปรี้ยวหวานและสีสันที่สวยงาม เหมาะสำหรับการรับประทานในมื้อเช้าหรือเป็นขนมว่าง",
        price: 90,
        stock: 25,
        images: "https://www.bakery.com/images/blueberry-muffin.jpg",
        categoryId: 2, // Replace with actual categoryId for bakery
        shopId: 5,
      },
      {
        productName: "บรรดาเค้กผลไม้",
        description:
          "บรรดาเค้กผลไม้มีหลายประเภทที่ใช้ผลไม้สดเป็นส่วนประกอบหลัก เช่น เค้กสตรอเบอรี, เค้กมะม่วง หรือเค้กแอปเปิ้ล รสชาติจะหวานอมเปรี้ยวและมีกลิ่นหอมของผลไม้",
        price: 200,
        stock: 18,
        images: "https://www.bakery.com/images/fruit-cake.jpg",
        categoryId: 2, // Replace with actual categoryId for bakery
        shopId: 5,
      },
      {
        productName: "ขนมปังชอคโกแลต",
        description:
          "ขนมปังชอคโกแลตเป็นขนมปังที่มีชอคโกแลตอัดแน่นอยู่ภายใน มีรสชาติหวานและเนย ช่วยเพิ่มความนุ่มและอร่อยให้กับขนมปัง",
        price: 60,
        stock: 40,
        images: "https://www.bakery.com/images/chocolate-bread.jpg",
        categoryId: 2, // Replace with actual categoryId for bakery
        shopId: 5,
      },
    ],
  });

  ("Bakery seed data inserted");
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
