/**
 * Standard names a Postgres connection string may arrive under, most preferred first.
 * All of these are pooled connections, which is what serverless functions want.
 */
const CANDIDATES = ["DATABASE_URL", "POSTGRES_PRISMA_URL", "POSTGRES_URL"] as const;

/**
 * Resolves the Postgres connection string from the environment.
 *
 * Vercel's Postgres (Neon) integration namespaces every variable it creates with a
 * project-chosen prefix — `kyabise_DATABASE_URL` rather than `DATABASE_URL`. Reading
 * only `DATABASE_URL` therefore finds nothing on a deployment wired up that way, and
 * every database-backed page fails.
 *
 * So: exact names win, then any `<prefix>_<known name>` provided by the integration.
 * Matching on the suffix rather than a hardcoded prefix keeps this working if the
 * database is renamed or reconnected under a different one.
 */
export function resolveDatabaseUrl(env: NodeJS.ProcessEnv = process.env): string | undefined {
  for (const name of CANDIDATES) {
    const value = env[name];
    if (value) return value;
  }

  for (const name of CANDIDATES) {
    const key = Object.keys(env).find((k) => k.endsWith(`_${name}`) && env[k]);
    if (key) return env[key];
  }

  return undefined;
}
