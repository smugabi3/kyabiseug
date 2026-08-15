import { config } from "dotenv";
config({ path: ".env" });
config({ path: ".env.local", override: true });

import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hashPassword } from "../src/lib/auth";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

/**
 * One-time bootstrap for the site's super admin account. Reads credentials from
 * environment variables rather than hardcoding them in source, so a real password
 * never ends up committed to the repo. Re-running it is safe — it just updates the
 * same account (matched by email) rather than creating a duplicate.
 *
 * Usage: set ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD in .env.local, then:
 *   npm run admin:create
 */
async function main() {
  const name = process.env.ADMIN_NAME;
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!name || !email || !password) {
    console.error(
      "Missing ADMIN_NAME, ADMIN_EMAIL or ADMIN_PASSWORD. Set them in .env.local and re-run."
    );
    process.exit(1);
  }
  if (password.length < 8) {
    console.error("ADMIN_PASSWORD must be at least 8 characters.");
    process.exit(1);
  }

  const existingSuperAdmin = await prisma.user.findFirst({ where: { isSuperAdmin: true } });
  if (existingSuperAdmin && existingSuperAdmin.email !== email) {
    console.error(
      `A super admin already exists (${existingSuperAdmin.email}). Refusing to create a second one. ` +
        "Edit that account from the Users page instead, or update it directly if this is intentional."
    );
    process.exit(1);
  }

  const user = await prisma.user.upsert({
    where: { email },
    update: { name, role: "admin", isSuperAdmin: true, password: await hashPassword(password) },
    create: { name, email, role: "admin", isSuperAdmin: true, password: await hashPassword(password) },
  });

  console.log(`Super admin ready: ${user.name} <${user.email}>`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
