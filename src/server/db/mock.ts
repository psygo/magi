import { db } from "."
import { users } from "./schema"

export async function insertUser() {
  await db.insert(users).values({
    clerkId: "psygo",
    username: "psygo",
    firstName: "Philippe",
    lastName: "Fanaro",
  })
}

// // eslint-disable-next-line @typescript-eslint/no-floating-promises
// insertUser()
