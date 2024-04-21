"use server"

import { sql } from "drizzle-orm"

import { db, nodes } from "@server"

import { type ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types"

import "@utils/array"

import { userIdFromClerk } from "../../utils/exports"

export async function postNodes(
  excalElements: ExcalidrawElement[],
) {
  try {
    const userId = await userIdFromClerk()
    if (!userId) return

    const nodeData = await db
      .insert(nodes)
      .values(
        excalElements.map((el) => ({
          excalId: el.id,
          title: "",
          description: "",
          excalData: el,
          creatorId: userId,
        })),
      )
      .onConflictDoUpdate({
        target: nodes.excalId,
        set: {
          excalData: sql.raw(
            `excluded.${nodes.excalData.name}`,
          ),
        },
      })
      .returning()

    return nodeData
  } catch (e) {
    console.error(e)
  }
}
