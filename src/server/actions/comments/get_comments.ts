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
    const n = await db
      .select({
        ...getTableColumns(comments),
        creator: {
          ...getTableColumns(users),
        },
      })
      .from(comments)
      .where(eq(nodes.excalId, excalId))
      .leftJoin(votes, eq(nodes.excalId, votes.nodeId))
      .leftJoin(users, eq(nodes.creatorId, users.id))
      .groupBy(nodes.id, users.id)

    return n as SelectCommentWithCreator[]
  } catch (e) {
    console.error(e)
  }
}
