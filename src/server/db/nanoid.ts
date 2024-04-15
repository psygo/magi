import { nanoid } from "nanoid"

export type Nanoid = string

export function standardNanoid(length = 8) {
  return nanoid(length)
}

export function standardNanoids(
  howMany = 1,
  nidLength = 8,
): Nanoid[] {
  return Array.from({ length: howMany }, () =>
    standardNanoid(nidLength),
  )
}
