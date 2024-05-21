import {
  type InferInsertModel,
  type InferSelectModel,
} from "drizzle-orm"

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { users } from "@server"

export type SelectUser = InferSelectModel<typeof users>
export type InsertUser = InferInsertModel<typeof users>

export type WithCreator = {
  creator?: SelectUser
}

export type WithCreatorAndCreatorStats = {
  creator?: SelectUser
}

export type WithUserStats = {
  stats?: {
    voteTotal: number
  }
}

export type SelectUserWithStats = SelectUser & WithUserStats
