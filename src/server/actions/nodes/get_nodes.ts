"use server"

import { desc, eq, sql, getTableColumns } from "drizzle-orm"

import "@utils/array"

import {
  type ExcalId,
  type SelectNodeWithCreatorAndStats,
} from "@types"

import { db, nodes, votes, users } from "@server"

export async function getNodes() {
  try {
    const n = await db
      .select({
        ...getTableColumns(nodes),
        creator: {
          ...getTableColumns(users),
        },
        stats: {
          voteTotal:
            sql<number>`sum(${votes.points})`.mapWith(
              Number,
            ),
        },
      })
      .from(nodes)
      .orderBy(desc(nodes.updatedAt))
      .leftJoin(votes, eq(nodes.excalId, votes.nodeId))
      .leftJoin(users, eq(nodes.creatorId, users.id))
      .groupBy(nodes.id, users.id)

    return n as SelectNodeWithCreatorAndStats[]
  } catch (e) {
    console.error(e)
  }
}

export async function getNode(excalId: ExcalId) {
  try {
    const n = (
      await db
        .select({
          ...getTableColumns(nodes),
          creator: {
            ...getTableColumns(users),
          },
          stats: {
            voteTotal:
              sql<number>`sum(${votes.points})`.mapWith(
                Number,
              ),
          },
        })
        .from(nodes)
        .where(eq(nodes.excalId, excalId))
        .leftJoin(votes, eq(nodes.excalId, votes.nodeId))
        .leftJoin(users, eq(nodes.creatorId, users.id))
        .groupBy(nodes.id, users.id)
        .limit(1)
    ).first()

    console.log(n)

    return n as SelectNodeWithCreatorAndStats
  } catch (e) {
    console.error(e)
  }
}
