"use server"

import { eq } from "drizzle-orm"

import "@utils/array"

import { type NanoId } from "@types"

import { canvases, db } from "@server"

import { userIdFromClerk } from "../../utils/exports"

export async function putCanvas(
  newTitle: string,
  canvasId: NanoId,
) {
  try {
    const userId = await userIdFromClerk()
    if (!userId) return

    const commentPutData = await db
      .update(canvases)
      .set({
        title: newTitle,
        updatedAt: new Date(),
      })
      .where(eq(canvases.nanoId, canvasId))
      .returning()

    return commentPutData
  } catch (e) {
    console.error(e)
  }
}
