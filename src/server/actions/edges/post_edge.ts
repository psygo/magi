"use server"

import { sql } from "drizzle-orm"

import { db, edges } from "@server"

import { type ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types"

import "@utils/array"

import { userIdFromClerk } from "../../utils/exports"

export async function postEdges(
  excalElements: ExcalidrawElement[],
) {
  try {
    const userId = await userIdFromClerk()
    if (!userId) return

    const edgeData = await db
      .insert(edges)
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
        target: edges.excalId,
        set: {
          excalData: sql.raw(
            `excluded.${edges.excalData.name}`,
          ),
        },
      })
      .returning()

    return edgeData
  } catch (e) {
    console.error(e)
  }
}
