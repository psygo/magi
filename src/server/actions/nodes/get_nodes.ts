"use server"

import {
  desc,
  eq,
  sql,
  getTableColumns,
  and,
  gte,
  lte,
  SQL,
  or,
} from "drizzle-orm"

import "@utils/array"

import {
  type SelectNodeWithCreatorAndStatsAndCreatorStats,
  type ExcalId,
  type SelectNodeWithCreatorAndStats,
  type FieldOfView,
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
import { cookies } from "next/headers"

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

const defaultFov: FieldOfView = {
  xLeft: 0,
  xRight: 1_000,
  yTop: 0,
  yBottom: 1_000,
}

export async function getNodes(
  fovs: FieldOfView[] = [defaultFov],
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
      .where(
        conditions,
        // and(
        //   and(
        //     gte(nodes.x, Math.ceil(fov.xLeft)),
        //     lte(nodes.x, Math.ceil(fov.xRight)),
        //     gte(nodes.y, Math.ceil(fov.yTop)),
        //     lte(nodes.y, Math.ceil(fov.yBottom)),
        //   ),
        // ),
      )
      .orderBy(desc(nodes.updatedAt))

    console.log("nodes", n.length)

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
