"use server"

import { desc } from "drizzle-orm"

import { db, nodes } from "@server"

export async function getNodes() {
  try {
    return await db
      .select()
      .from(nodes)
      .orderBy(desc(nodes.updatedAt))
  } catch (e) {
    console.error(e)
  }
}
