import {
  type InferInsertModel,
  type InferSelectModel,
} from "drizzle-orm"

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { comments } from "@server"

import { type WithCreator } from "./users"

export type SelectComment = InferSelectModel<
  typeof comments
>
export type InsertComment = InferInsertModel<
  typeof comments
>

export type SelectCommentWithCreator = SelectComment &
  WithCreator
