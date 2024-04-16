"use server"

import { db, nodes } from "@server"

export async function postNode(
  title: string,
  description: string,
  x: number,
  y: number,
) {
  try {
    return await db.insert(nodes).values({
      title,
      description,
      x,
      y,
    })
  } catch (e) {
    console.error(e)
  }
}
