import { defineConfig } from "drizzle-kit"

import { env } from "~/env"

export default defineConfig({
  schema: "./src/server/db/schema.ts",
  driver: "pg",
  dbCredentials: {
    connectionString: env.POSTGRES_URL,
  },
  tablesFilter: ["magi_*"],
})
