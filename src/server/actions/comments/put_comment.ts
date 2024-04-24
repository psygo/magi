"use server"

import { and, eq } from "drizzle-orm"

import "@utils/array"

import {
  type SelectCommentWithCreator,
  type NanoId,
} from "@types"

import { comments, db } from "@server"

import { getComment } from "@actions"

import { userIdFromClerk } from "../../utils/exports"

export async function putComment(
  content: string,
  nanoId: NanoId,
) {
  try {
    const userId = await userIdFromClerk()
    if (!userId) return

    const commentInsertData = await db
      .update(comments)
      .set({
        content,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(comments.nanoId, nanoId),
          eq(comments.commenterId, userId),
        ),
      )
      .returning()

    const commentData = await getComment(
      commentInsertData.first().nanoId,
    )

    // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style
    return commentData as SelectCommentWithCreator
  } catch (e) {
    console.error(e)
  }
}
