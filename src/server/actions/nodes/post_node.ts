"use server"

import { type ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types"

import "@utils/array"

import { db, nodes } from "@server"

export async function postNode(
  excalData: ExcalidrawElement,
) {
  try {
    const nodeData = await db
      .insert(nodes)
      .values({
        title: "",
        description: "",
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

export async function postNodes(
  excalElements: ExcalidrawElement[],
) {
  try {
    const nodeData = await db
      .insert(nodes)
      .values(
        excalElements.map((el) => ({
          title: "",
          description: "",
          excalData: el,
        })),
      )
      .returning({ id: nodes.id })

    return nodeData.first()
  } catch (e) {
    console.error(e)
  }
}
