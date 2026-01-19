import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@platform.local" },
    update: {},
    create: {
      email: "admin@platform.local",
      password,
      role: "SUPERADMIN",
    },
  });
}

main();