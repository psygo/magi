"use server"

import { comments, db } from "@server"

import { userIdFromClerk } from "../../utils/exports"

export async function postComment(content: string) {
  try {
    const userId = await userIdFromClerk()
    if (!userId) return

    const commentData = await db
      .insert(comments)
      .values({
        content,
        commenterId: userId,
      })
      .returning()

    return commentData
  } catch (e) {
    console.error(e)
  }
}
