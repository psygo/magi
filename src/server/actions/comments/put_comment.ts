"use server"

import { eq } from "drizzle-orm"

import { type NanoId } from "@types"

import { comments, db } from "@server"

import { userIdFromClerk } from "../../utils/exports"

export async function putComment(
  content: string,
  nanoId: NanoId,
) {
  try {
    const userId = await userIdFromClerk()
    if (!userId) return

    const commentData = await db
      .update(comments)
      .set({
        content,
        updatedAt: new Date(),
      })
      .where(eq(comments.nanoId, nanoId))
      .returning()

    return commentData
  } catch (e) {
    console.error(e)
  }
}
