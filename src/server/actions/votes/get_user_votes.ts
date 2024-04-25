"use server"

import { and, eq } from "drizzle-orm"

import "@utils/array"

import { type ExcalId } from "@types"

import { db, votes } from "@server"

import { userIdFromClerk } from "../../utils/exports"

export async function getUserVote(excalId: ExcalId) {
  try {
    const userId = await userIdFromClerk()
    if (!userId) return

    const userVote = await db
      .select()
      .from(votes)
      .where(
        and(
          eq(votes.voterId, userId),
          eq(votes.nodeId, excalId),
        ),
      )
      .limit(1)

    return userVote.first().points ?? 0
  } catch (e) {
    console.error(e)
  }
}
