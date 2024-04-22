import { type InferSelectModel } from "drizzle-orm"

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { edges } from "@server"

import { type WithCreator } from "./users"
import { type WithNodeStats } from "./nodes"
import { type ExcalId } from "./id"

export type SelectEdge = InferSelectModel<typeof edges>
export type InsertEdge = InferSelectModel<typeof edges>

export type WithEdgeStats = WithNodeStats

export type SelectEdgeWithCreatorAndStats = SelectEdge &
  WithEdgeStats &
  WithCreator

export type EdgesRecords = Record<
  ExcalId,
  SelectEdgeWithCreatorAndStats
>
