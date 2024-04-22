"use server"

import { eq } from "drizzle-orm"

import { db, edges } from "@server"

import { type ExcalId } from "@types"

export async function putEdge(
  excalId: ExcalId,
  title?: string,
  description?: string,
) {
  try {
    const updatedEdge = await db
      .update(edges)
      .set({
        title: title ?? "",
        description: description ?? "",
      })
      .where(eq(edges.excalId, excalId))
      .returning()

    return updatedEdge
  } catch (e) {
    console.error(e)
  }
}
