"use server"

import { eq } from "drizzle-orm"

import "@utils/array"

import { db, getNode, nodes } from "@server"

import { type ExcalId } from "@types"

export async function putNode(
  excalId: ExcalId,
  title?: string,
  description?: string,
) {
  try {
    await db
      .update(nodes)
      .set({
        title: title ?? "",
        description: description ?? "",
        updatedAt: new Date(),
      })
      .where(eq(nodes.excalId, excalId))
      .returning()

    const newNode = await getNode(excalId)

    return newNode
  } catch (e) {
    console.error(e)
  }
}
