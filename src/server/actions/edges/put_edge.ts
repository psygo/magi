"use server"

import { eq } from "drizzle-orm"

import "@utils/array"

import { db, edges, getEdge } from "@server"

import { type ExcalId } from "@types"

export async function putEdge(
  excalId: ExcalId,
  title?: string,
  description?: string,
) {
  try {
    await db
      .update(edges)
      .set({
        title: title ?? "",
        description: description ?? "",
        updatedAt: new Date(),
      })
      .where(eq(edges.excalId, excalId))
      .returning()

    const newEdge = await getEdge(excalId)

    return newEdge
  } catch (e) {
    console.error(e)
  }
}
