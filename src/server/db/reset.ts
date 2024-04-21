import "server-only"

import { sql } from "drizzle-orm"

import { db } from "."
import { mockUsers } from "./mock"
import { nodes, users } from "./schema"

export async function reset() {
  try {
    await deleteEverything()

    await mockUsers()
  } catch (e) {
    console.error(e)
  }
}

async function deleteEverything() {
  try {
    // eslint-disable-next-line drizzle/enforce-delete-with-where
    await db.delete(nodes)
    // eslint-disable-next-line drizzle/enforce-delete-with-where
    await db.delete(users)

    const tableSchema = db._.schema
    if (!tableSchema) {
      throw new Error("No table schema found")
    }

    console.log("🗑️  Emptying the entire database")

    const queries = Object.values(tableSchema).map(
      (table) => {
        console.log(
          `🧨 Preparing delete query for table: ${table.dbName}`,
        )
        return sql.raw(/* sql */ `
          TRUNCATE TABLE ${table.dbName} CASCADE;
        `)
      },
    )

    console.log("📨 Sending delete queries...")

    await db.transaction(async (tx) => {
      await Promise.all(
        queries.map(async (query) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          if (query) await tx.execute(query)
        }),
      )
    })

    console.log("✅ Database emptied")
  } catch (e) {
    console.error(e)
  }
}
