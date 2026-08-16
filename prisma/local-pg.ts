import EmbeddedPostgres from "embedded-postgres";
import { existsSync } from "node:fs";
import path from "node:path";

/**
 * Runs a self-contained local Postgres instance for development on machines
 * without Docker or a system Postgres install. Data persists in .local-pg-data
 * (gitignored) between runs. Not used in production — Vercel/production points
 * DATABASE_URL at a real hosted Postgres instead.
 *
 * Usage: npm run db:local
 */
const dataDir = path.join(process.cwd(), ".local-pg-data");
const isFirstRun = !existsSync(path.join(dataDir, "PG_VERSION"));

const pg = new EmbeddedPostgres({
  databaseDir: dataDir,
  user: "postgres",
  password: "postgres",
  port: 5433,
  persistent: true,
});

async function main() {
  if (isFirstRun) {
    console.log("Initialising local Postgres cluster...");
    await pg.initialise();
  }

  await pg.start();
  console.log("Postgres listening on port 5433");

  if (isFirstRun) {
    await pg.createDatabase("kyabiseug");
    console.log("Created database 'kyabiseug'");
  }

  console.log("Ready. Connection string:");
  console.log("  postgresql://postgres:postgres@localhost:5433/kyabiseug?schema=public");
  console.log("Press Ctrl+C to stop.");

  // Keep the process alive; the Postgres child process runs under it.
  process.stdin.resume();
}

async function shutdown() {
  console.log("\nStopping Postgres...");
  await pg.stop();
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
