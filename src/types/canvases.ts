import {
  type InferInsertModel,
  type InferSelectModel,
} from "drizzle-orm"

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { canvases } from "@server"

export type SelectCanvas = InferSelectModel<typeof canvases>
export type InsertCanvas = InferInsertModel<typeof canvases>
