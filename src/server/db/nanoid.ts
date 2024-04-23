import { nanoid } from "nanoid"

import { type NanoId } from "@types"

export function standardNanoid(length = 8) {
  return nanoid(length)
}

export function standardNanoids(
  howMany = 1,
  nidLength = 8,
): NanoId[] {
  return Array.from({ length: howMany }, () =>
    standardNanoid(nidLength),
  )
}
