"use server"

import { eq } from "drizzle-orm"

import "@utils/array"

import { type NanoId } from "@types"

import { canvases, db } from "@server"

import { userIdFromClerk } from "../../utils/exports"

export async function deleteCanvas(canvasId: NanoId) {
  try {
    const userId = await userIdFromClerk()
    if (!userId) return

    const commentPutData = await db
      .update(canvases)
      .set({
        isDeleted: true,
        updatedAt: new Date(),
      })
      .where(eq(canvases.nanoId, canvasId))
      .returning()

    return commentPutData
  } catch (e) {
    console.error(e)
  }
}
