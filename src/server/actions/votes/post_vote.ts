"use server"

import "@utils/array"

import { type ExcalId } from "@types"

import { db, votes } from "@server"

export async function postVote(
  excalId: ExcalId,
  up: boolean,
) {
  try {
    const voteData = await db
      .insert(votes)
      .values({
        voterId: 1,
        points: up ? 1 : -1,
        nodeId: excalId,
      })
      .returning({ id: votes.id })

    return voteData.first()
  } catch (e) {
    console.error(e)
  }
}
