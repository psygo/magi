"use server"

import { desc, eq, sql, getTableColumns } from "drizzle-orm"

import "@utils/array"

import {
  type ExcalId,
  type SelectEdgeWithCreatorAndStats,
} from "@types"

import { db, votes, users, edges } from "@server"

export async function getEdges() {
  try {
    const n = await db
      .select({
        ...getTableColumns(edges),
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
      .from(edges)
      .orderBy(desc(edges.updatedAt))
      .leftJoin(votes, eq(edges.excalId, votes.nodeId))
      .leftJoin(users, eq(edges.creatorId, users.id))
      .groupBy(edges.id, users.id)

    return n as SelectEdgeWithCreatorAndStats[]
  } catch (e) {
    console.error(e)
  }
}

export async function getEdge(excalId: ExcalId) {
  try {
    const n = (
      await db
        .select({
          ...getTableColumns(edges),
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
        .from(edges)
        .where(eq(edges.excalId, excalId))
        .leftJoin(votes, eq(edges.excalId, votes.nodeId))
        .leftJoin(users, eq(edges.creatorId, users.id))
        .groupBy(edges.id, users.id)
        .limit(1)
    ).first()

    return n as SelectEdgeWithCreatorAndStats
  } catch (e) {
    console.error(e)
  }
}