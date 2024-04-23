"use server"

import { comments, db } from "@server"

import { type ExcalId } from "@types"

import { userIdFromClerk } from "../../utils/exports"

export async function postComment(
  content: string,
  excalId: ExcalId,
) {
  try {
    const userId = await userIdFromClerk()
    if (!userId) return

    const commentData = await db
      .insert(comments)
      .values({
        content,
        commenterId: userId,
        nodeId: excalId,
      })
      .returning()

    return commentData
  } catch (e) {
    console.error(e)
  }
}
