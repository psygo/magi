"use server"

import { eq } from "drizzle-orm"

import { db, nodes } from "@server"

import { type ExcalId } from "@types"

export async function putNode(
  excalId: ExcalId,
  title?: string,
  description?: string,
) {
  try {
    const updatedNode = await db
      .update(nodes)
      .set({
        title: title ?? "",
        description: description ?? "",
        updatedAt: new Date(),
      })
      .where(eq(nodes.excalId, excalId))
      .returning()

    return updatedNode
  } catch (e) {
    console.error(e)
  }
}
