import { PrismaClient, Role } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = "testuser@example.com";
  const password = "TestPassword123!";
  const name = "Test User";

  const existingUser = await prisma.adminUser.findUnique({
    where: { email },
  });

  if (existingUser) {
    console.log("User already exists.");
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.adminUser.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role: Role.EDITOR,
      isActive: true,
    },
  });

  console.log(`Test user created: ${email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
