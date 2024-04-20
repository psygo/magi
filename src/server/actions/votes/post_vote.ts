"use server"

import { type ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types"

import "@utils/array"

import { ExcalId } from "@types"

import { db, nodes, votes } from "@server"

export async function postNode(
  excalId: ExcalId,
  up: boolean,
) {
  try {
    // const voteData = await db
    //   .insert(votes)
    //   .values({
    //     description: "",
    //   })
    //   .returning({ id: votes.id })
    // return voteData.first()
  } catch (e) {
    console.error(e)
  }
}
