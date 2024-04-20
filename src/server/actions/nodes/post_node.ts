"use server"

import { type ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types"

import "@utils/array"

import { db, nodes } from "@server"
import { sql } from "drizzle-orm"

export async function postNode(
  excalData: ExcalidrawElement,
) {
  try {
    const nodeData = await db
      .insert(nodes)
      .values({
        excalId: excalData.id,
        title: "",
        description: "",
        excalData,
      })
      .returning({ id: nodes.id })

    return nodeData.first()
  } catch (e) {
    console.error(e)
  }
}

export async function postNodes(
  excalElements: ExcalidrawElement[],
) {
  try {
    const nodeData = await db
      .insert(nodes)
      .values(
        excalElements.map((el) => ({
          excalId: el.id,
          title: "",
          description: "",
          excalData: el,
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
      .returning({ id: nodes.id })

    return nodeData.first()
  } catch (e) {
    console.error(e)
  }
}
