"use server"

import { desc, eq, sql, getTableColumns } from "drizzle-orm"

import {
  type SelectNode,
  db,
  nodes,
  votes,
  users,
} from "@server"

export type WithStats = {
  stats: Partial<WithVotesTotal>
}

export type WithVotesTotal = {
  voteTotal: number
}

export type SelectNodeWithStats = SelectNode & WithStats

export async function getNodes() {
  try {
    const n = await db
      .select({
        ...getTableColumns(nodes),
        creator: {
          ...getTableColumns(users),
        },
        stats: {
          voteTotal: sql<number>`sum(${votes.points})`,
        },
      })
      .from(nodes)
      .orderBy(desc(nodes.updatedAt))
      .leftJoin(votes, eq(nodes.excalId, votes.nodeId))
      .leftJoin(users, eq(nodes.creatorId, users.id))
      .groupBy(nodes.id, users.id)

    console.log(n)

    return n
  } catch (e) {
    console.error(e)
  }
}
