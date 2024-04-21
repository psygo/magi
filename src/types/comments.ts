import { type InferSelectModel } from "drizzle-orm"

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { comments } from "@server"

export type SelectComment = InferSelectModel<
  typeof comments
>
export type InsertComment = InferSelectModel<
  typeof comments
>
