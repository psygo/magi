import "server-only"

import { db } from "."
import { users } from "./schema"

export async function mockUsers() {
  try {
    await db.insert(users).values({
      clerkId: "psygo",
      username: "psygo",
      email: "philippe@fanaro.com",
      firstName: "Philippe",
      lastName: "Fanaro",
    })

    console.log("✅ User data generated")
  } catch (e) {
    console.error(e)
  }
}
