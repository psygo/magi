"use server"

import { eq, getTableColumns } from "drizzle-orm"

import "@utils/array"

import {
  type SelectCommentWithCreator,
  type ExcalId,
} from "@types"

import { db, votes, users, comments, nodes } from "@server"

export async function getComments(excalId: ExcalId) {
  try {
    const c = await db
      .select({
        ...getTableColumns(comments),
        creator: {
          ...getTableColumns(users),
        },
      })
      .from(comments)
      .leftJoin(nodes, eq(comments.nodeId, nodes.excalId))
      .where(eq(nodes.excalId, excalId))
      .leftJoin(users, eq(nodes.creatorId, users.id))
      .leftJoin(votes, eq(nodes.excalId, votes.nodeId))
      .groupBy(comments.id, nodes.id, users.id)

    return c as SelectCommentWithCreator[]
  } catch (e) {
    console.error(e)
  }
}
