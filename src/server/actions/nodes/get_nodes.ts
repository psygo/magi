"use server"

import {
  desc,
  eq,
  sql,
  getTableColumns,
  and,
  gte,
  lte,
} from "drizzle-orm"

import "@utils/array"

import {
  type SelectNodeWithCreatorAndStatsAndCreatorStats,
  type ExcalId,
  type SelectNodeWithCreatorAndStats,
} from "@types"

import {
  db,
  nodes,
  votes,
  users,
  comments,
  getUserVote,
} from "@server"

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

export async function getNodes(
  xLeft = 0,
  xRight = 1_000,
  yBottom = 0,
  yTop = 1_000,
) {
  try {
    const n = await getNodeQuery()
      .where(
        and(
          and(gte(nodes.x, xLeft), lte(nodes.x, xRight)),
          and(gte(nodes.y, yBottom), lte(nodes.x, yTop)),
        ),
      )
      .orderBy(desc(nodes.updatedAt))

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

    const userVotedPoints = await getUserVote(excalId)

    return {
      ...n,
      creator: creatorWithStats,
      stats: {
        ...n.stats,
        votedPoints: userVotedPoints,
      },
    } as SelectNodeWithCreatorAndStatsAndCreatorStats
  } catch (e) {
    console.error(e)
  }
}
