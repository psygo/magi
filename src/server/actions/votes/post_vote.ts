"use server"

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
