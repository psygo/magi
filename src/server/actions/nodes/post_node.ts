"use server"

import { type ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types"

import { db, nodes } from "@server"

export async function postNode(
  title: string,
  description: string,
  excalData: ExcalidrawElement,
) {
  try {
    await db.insert(nodes).values({
      title,
      description,
      excalData: {
        ...excalData,
        customData: {},
      },
    })
  } catch (e) {
    console.error(e)
  }
}
