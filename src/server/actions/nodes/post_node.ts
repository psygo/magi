"use server"

import { currentUser } from "@clerk/nextjs/server"

import { sql } from "drizzle-orm"

import { db, nodes } from "@server"

import { type ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types"

import "@utils/array"

export async function postNode(
  excalData: ExcalidrawElement,
) {
  try {
    const user = await currentUser()
    const userId = user?.privateMetadata.id

    const nodeData = await db
      .insert(nodes)
      .values({
        excalId: excalData.id,
        title: "",
        description: "",
        excalData,
        creatorId: 1,
      })
      .returning()

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
          creatorId: 1,
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
