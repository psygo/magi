import { type InferSelectModel } from "drizzle-orm"

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { nodes } from "@server"

import { type WithCreator } from "./users"
import { type ExcalId } from "./id"

export type SelectNode = InferSelectModel<typeof nodes>
export type InsertNode = InferSelectModel<typeof nodes>

export type WithNodeStats = {
  stats?: {
    voteTotal?: number
  }
}

export type SelectNodeWithCreatorAndStats = SelectNode &
  WithNodeStats &
  WithCreator

export type NodesRecords = Record<
  ExcalId,
  SelectNodeWithCreatorAndStats
>
