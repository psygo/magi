"use server"

import { and, eq } from "drizzle-orm"

import "@utils/array"

import { type ExcalId } from "@types"

import { db, votes } from "@server"

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

    const voteData = await db
      .insert(votes)
      .values({
        points: up ? 1 : -1,
        voterId: userId,
        nodeId: excalId,
      })
      .returning({ id: votes.id })

    return voteData.first()
  } catch (e) {
    console.error(e)
  }
}
