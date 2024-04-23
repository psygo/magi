"use server"

import { desc, eq, getTableColumns } from "drizzle-orm"

import "@utils/array"

import {
  type SelectCommentWithCreator,
  type ExcalId,
  type NanoId,
} from "@types"

import { db, users, comments, nodes } from "@server"

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
      .where(eq(nodes.excalId, excalId))
      .leftJoin(nodes, eq(comments.nodeId, nodes.excalId))
      .leftJoin(users, eq(nodes.creatorId, users.id))
      .groupBy(comments.id, nodes.id, users.id)
      .orderBy(desc(comments.updatedAt))

    return c as SelectCommentWithCreator[]
  } catch (e) {
    console.error(e)
  }
}

export async function getComment(commentNanoId: NanoId) {
  try {
    const c = await db
      .select({
        ...getTableColumns(comments),
        creator: {
          ...getTableColumns(users),
        },
      })
      .from(comments)
      .where(eq(comments.nanoId, commentNanoId))
      .leftJoin(users, eq(comments.commenterId, users.id))
      .groupBy(comments.id, users.id)
      .limit(1)

    return c.first() as SelectCommentWithCreator
  } catch (e) {
    console.error(e)
  }
}
