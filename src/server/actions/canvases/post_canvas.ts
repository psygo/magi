"use server"

import { canvases, db } from "@server"

import { userIdFromClerk } from "../../utils/exports"

export async function postCanvas(
  title: string,
  description = "",
) {
  try {
    const userId = await userIdFromClerk()
    if (!userId) return

    const canvasInsertData = await db
      .insert(canvases)
      .values({
        title,
        description,
        ownerId: userId,
      })
      .returning()

    return canvasInsertData
  } catch (e) {
    console.error(e)
  }
}
