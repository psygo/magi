"use server"

import { desc, eq } from "drizzle-orm"

import "@utils/array"

import { db, canvases } from "@server"

import { userIdFromClerk } from "../../utils/exports"

export async function getCanvases() {
  try {
    const userId = await userIdFromClerk()
    if (!userId) return

    const c = await db
      .select()
      .from(canvases)
      .where(eq(canvases.ownerId, userId))
      .orderBy(desc(canvases.updatedAt))

    return c
  } catch (e) {
    console.error(e)
  }
}
