"use server"

import { sql } from "drizzle-orm"

import { db, edges } from "@server"

import { type ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types"

import { type ExcalId } from "@types"

import { userIdFromClerk } from "../../utils/exports"

export async function postEdges(
  excalElements: ExcalidrawElement[],
  fromId: ExcalId,
  toId: ExcalId,
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
          fromId,
          toId,
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
