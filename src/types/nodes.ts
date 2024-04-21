import { type SelectNode } from "@server"

import { type WithCreator } from "./users"

export type WithNodeStats = {
  stats?: {
    voteTotal?: number
  }
}

export type SelectNodeWithCreatorAndStats = SelectNode &
  WithNodeStats &
  WithCreator
