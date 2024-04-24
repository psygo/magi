"use server"

import { sql } from "drizzle-orm"

import { db, nodes } from "@server"

import {
  type ExcalidrawArrowElement,
  type ExcalidrawElement,
} from "@excalidraw/excalidraw/types/element/types"

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
        excalElements.map((el) => {
          const arrowData =
            el.type === "arrow"
              ? {
                  fromId: (el as ExcalidrawArrowElement)
                    .startBinding?.elementId,
                  toId: (el as ExcalidrawArrowElement)
                    .endBinding?.elementId,
                }
              : {}

          return {
            excalId: el.id,
            title: "",
            description: "",
            excalData: el,
            isDeleted: el.isDeleted,
            creatorId: userId,
            ...arrowData,
          }
        }),
      )
      .onConflictDoUpdate({
        target: nodes.excalId,
        where: sql`magi_nodes.creator_id = ${userId}`,
        set: {
          excalData: sql.raw(
            `excluded.${nodes.excalData.name}`,
          ),
          isDeleted: sql.raw(
            `excluded.${nodes.isDeleted.name}`,
          ),
          fromId: sql.raw(`excluded.${nodes.fromId.name}`),
          toId: sql.raw(`excluded.${nodes.toId.name}`),
        },
      })
      .returning()

    return nodeData
  } catch (e) {
    console.error(e)
  }
}
