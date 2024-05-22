export type Point = [number, number]

export type ScrollAndZoom = {
  scrollX: number
  scrollY: number
  zoom: number
}

export type FieldOfView = {
  xLeft: number
  xRight: number
  yTop: number
  yBottom: number
}

export const defaultFov: FieldOfView = {
  xLeft: 0,
  xRight: 1_000,
  yTop: 0,
  yBottom: 1_000,
}

export type Pointer = {
  x: number
  y: number
}
