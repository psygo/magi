"use server"

import { eq, sql, getTableColumns } from "drizzle-orm"

import "@utils/array"

import {
  type NumberId,
  type SelectUserWithStats,
} from "@types"

import { db, nodes, votes, users } from "@server"

export async function getUser(userId: NumberId) {
  try {
    const userWithStats = await db
      .select({
        ...getTableColumns(users),
        stats: {
          voteTotal:
            sql<number>`sum(${votes.points})`.mapWith(
              Number,
            ),
        },
      })
      .from(users)
      .leftJoin(nodes, eq(nodes.creatorId, userId))
      .leftJoin(votes, eq(nodes.excalId, votes.nodeId))
      .groupBy(users.id)
      .limit(1)

    return userWithStats.first() as SelectUserWithStats
  } catch (e) {
    console.error(e)
  }
}
