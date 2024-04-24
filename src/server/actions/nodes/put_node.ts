"use server"

import { and, eq } from "drizzle-orm"

import "@utils/array"

import { db, getNode, nodes } from "@server"

import { type ExcalId } from "@types"

import { userIdFromClerk } from "../../utils/exports"

export async function putNode(
  excalId: ExcalId,
  title?: string,
  description?: string,
) {
  try {
    const userId = await userIdFromClerk()
    if (!userId) return

    await db
      .update(nodes)
      .set({
        title: title ?? "",
        description: description ?? "",
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(nodes.excalId, excalId),
          eq(nodes.creatorId, userId),
        ),
      )
      .returning()

    const newNode = await getNode(excalId)

    return newNode
  } catch (e) {
    console.error(e)
  }
}
