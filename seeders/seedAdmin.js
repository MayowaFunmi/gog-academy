// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require("@prisma/client");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const username = "superadmin";
  const uniqueId = "0000AA";
  const firstName = "Super";
  const lastName = "Admin";
  const gender = "Male";
  const email = "superadmin@gog-academy.com";
  const phoneNumber = "1234567890";
  const role = "SuperAdmin";
  const password = "superadmin123";

  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { phoneNumber }, { username }],
    },
  });

  if (!existingUser) {
    await prisma.user.create({
      data: {
        username,
        uniqueId,
        firstName,
        lastName,
        gender,
        email,
        phoneNumber,
        password: hashedPassword,
        roles: {
          create: [
            {
              role: {
                connect: {
                  name: role,
                },
              },
            },
          ],
        },
      },
    });
    console.log("Superadmin seeded successfully");
  } else {
    console.log("Superadmin already exists");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
