"use server"

import {
  desc,
  eq,
  sql,
  getTableColumns,
  and,
  gte,
  lte,
  or,
} from "drizzle-orm"

import "@utils/array"

import {
  type SelectNodeWithCreatorAndStatsAndCreatorStats,
  type ExcalId,
  type SelectNodeWithCreatorAndStats,
  type FieldOfView,
  type NanoId,
  defaultFov,
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

function getNodesQuery() {
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
  fovs: FieldOfView[] = [defaultFov],
  canvasId: NanoId = "open-public",
) {
  try {
    const conditions = or(
      ...fovs.map((f) => {
        return and(
          gte(nodes.x, Math.ceil(f.xLeft)),
          lte(nodes.x, Math.ceil(f.xRight)),
          gte(nodes.y, Math.ceil(f.yTop)),
          lte(nodes.y, Math.ceil(f.yBottom)),
        )
      }),
    )

    const n = await getNodesQuery()
      .where(and(conditions, eq(nodes.canvasId, canvasId)))
      .orderBy(desc(nodes.updatedAt))

    return n as SelectNodeWithCreatorAndStats[]
  } catch (e) {
    console.error(e)
  }
}

export async function getNode(excalId: ExcalId) {
  try {
    const n = (
      await getNodesQuery()
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
