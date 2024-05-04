import { z } from "zod"

import { type ReactNode } from "react"

export type WithReactChildren = {
  children: ReactNode
}

export const colorSchema = z.string()
export type Color = z.infer<typeof colorSchema>

export type FieldOfView = {
  xLeft: number
  xRight: number
  yTop: number
  yBottom: number
}
