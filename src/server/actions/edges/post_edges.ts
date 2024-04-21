"use server"

import { sql } from "drizzle-orm"

import { db, edges } from "@server"

import { type ExcalidrawArrowElement } from "@excalidraw/excalidraw/types/element/types"

import { userIdFromClerk } from "../../utils/exports"

export async function postEdges(
  excalElements: ExcalidrawArrowElement[],
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
          fromId: el.startBinding?.elementId,
          toId: el.endBinding?.elementId,
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
