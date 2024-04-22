"use server"

import { eq, getTableColumns } from "drizzle-orm"

import "@utils/array"

import {
  type SelectCommentWithCreator,
  type ExcalId,
} from "@types"

import {
  db,
  votes,
  users,
  edges,
  comments,
  nodes,
} from "@server"

export async function getComments(
  excalId: ExcalId,
  isNode: boolean,
) {
  try {
    const nodeOrEdgeWhere = isNode
      ? eq(nodes.excalId, excalId)
      : eq(edges.excalId, excalId)

    const n = await db
      .select({
        ...getTableColumns(comments),
        creator: {
          ...getTableColumns(users),
        },
      })
      .from(comments)
      .where(nodeOrEdgeWhere)
      .leftJoin(votes, eq(edges.excalId, votes.nodeId))
      .leftJoin(users, eq(edges.creatorId, users.id))
      .groupBy(edges.id, users.id)

    return n as SelectCommentWithCreator[]
  } catch (e) {
    console.error(e)
  }
}
