import { type SelectEdge } from "@server"

import { type WithCreator } from "./users"
import { type WithNodeStats } from "./nodes"

export type WithEdgeStats = WithNodeStats

export type SelectEdgeWithCreatorAndStats = SelectEdge &
  WithEdgeStats &
  WithCreator
