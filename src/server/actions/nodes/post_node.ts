"use server"

import { type ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types"

import "@utils/array"

import { db, nodes } from "@server"

export async function postNode(
  title: string,
  description: string,
  excalData: ExcalidrawElement,
) {
  try {
    const nodeData = await db
      .insert(nodes)
      .values({
        title,
        description,
        excalData: {
          ...excalData,
          customData: {},
        },
      })
      .returning({ id: nodes.id })

    return nodeData.first()
  } catch (e) {
    console.error(e)
  }
}
