"use server"

import { desc, eq, sql, getTableColumns } from "drizzle-orm"

import "@utils/array"

import {
  type SelectNodeWithCreatorAndStatsAndCreatorStats,
  type ExcalId,
  type SelectNodeWithCreatorAndStats,
} from "@types"

import { db, nodes, votes, users, comments } from "@server"

import { getUser } from "../users/exports"

function getNodeQuery() {
  return db
    .select({
      ...getTableColumns(nodes),
      creator: {
        ...getTableColumns(users),
      },
      stats: {
        voteTotal:
          sql<number>`sum(${votes.points})`.mapWith(Number),
        commentTotal:
          sql<number>`count(${comments.id})`.mapWith(
            Number,
          ),
      },
    })
    .from(nodes)
    .leftJoin(users, eq(nodes.creatorId, users.id))
    .leftJoin(votes, eq(nodes.excalId, votes.nodeId))
    .leftJoin(comments, eq(nodes.excalId, comments.nodeId))
    .groupBy(nodes.id, users.id)
}

export async function getNodes() {
  try {
    const n = await getNodeQuery().orderBy(
      desc(nodes.updatedAt),
    )

    return n as SelectNodeWithCreatorAndStats[]
  } catch (e) {
    console.error(e)
  }
}

export async function getNode(excalId: ExcalId) {
  try {
    const n = (
      await getNodeQuery()
        .where(eq(nodes.excalId, excalId))
        .limit(1)
    ).first() as SelectNodeWithCreatorAndStats

    const creator = n.creator!

    const creatorWithStats = await getUser(creator.id)

    return {
      ...n,
      creator: creatorWithStats,
    } as SelectNodeWithCreatorAndStatsAndCreatorStats
  } catch (e) {
    console.error(e)
  }
}
