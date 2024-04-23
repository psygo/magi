"use server"

import "@utils/array"

import { comments, db } from "@server"

import { getComment } from "@actions"

import {
  type SelectCommentWithCreator,
  type ExcalId,
} from "@types"

import { userIdFromClerk } from "../../utils/exports"

export async function postComment(
  content: string,
  excalId: ExcalId,
) {
  try {
    const userId = await userIdFromClerk()
    if (!userId) return

    const commentInsertData = await db
      .insert(comments)
      .values({
        content,
        commenterId: userId,
        nodeId: excalId,
      })
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
