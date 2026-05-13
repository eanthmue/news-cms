import { PrismaClient, Role } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = process.env.INITIAL_ADMIN_EMAIL || "admin@example.com";
  const password = process.env.INITIAL_ADMIN_PASSWORD || "Admin123!";
  const name = "Super Admin";

  const existingAdmin = await prisma.adminUser.findUnique({
    where: { email },
  });

  if (existingAdmin) {
    console.log("Admin user already exists.");
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.adminUser.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role: Role.SUPER_ADMIN,
      isActive: true,
    },
  });

  console.log(`Initial super admin created: ${email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
