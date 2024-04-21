import { type InferSelectModel } from "drizzle-orm"

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { users } from "@server"

export type SelectUser = InferSelectModel<typeof users>
export type InsertUser = InferSelectModel<typeof users>

export type WithCreator = {
  creator?: SelectUser
}
