"use server"

import { sql } from "drizzle-orm"

import { db, nodes } from "@server"

import {
  type ExcalidrawArrowElement,
  type ExcalidrawElement,
} from "@excalidraw/excalidraw/types/element/types"

import { toInt } from "@utils"

import { type NanoId } from "@types"

import { userIdFromClerk } from "../../utils/exports"

export async function postNodes(
  excalElements: ExcalidrawElement[],
  canvasId: NanoId = "open-canvas",
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
            canvasId,
            excalId: el.id,
            title: "",
            description: "",
            excalData: el,
            x: toInt(el.x),
            y: toInt(el.y),
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
          x: sql.raw(`excluded.${nodes.x.name}`),
          y: sql.raw(`excluded.${nodes.y.name}`),
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
