"use server"

import { and, eq } from "drizzle-orm"

import "@utils/array"

import { type ExcalId } from "@types"

import { db, getNode, votes } from "@server"

import { userIdFromClerk } from "../../utils/exports"

export async function postVote(
  excalId: ExcalId,
  up: boolean,
) {
  try {
    const userId = await userIdFromClerk()
    if (!userId) return

    await db
      .delete(votes)
      .where(
        and(
          eq(votes.nodeId, excalId),
          eq(votes.voterId, userId),
        ),
      )

    await db
      .insert(votes)
      .values({
        points: up ? 1 : -1,
        voterId: userId,
        nodeId: excalId,
      })
      .returning({ id: votes.id })

    return await getNode(excalId)
  } catch (e) {
    console.error(e)
  }
}
