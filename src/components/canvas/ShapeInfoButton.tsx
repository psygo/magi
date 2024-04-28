"use client"

import { type ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types"

import "@utils/array"

import { type Point } from "@types"

import { useCanvas } from "@context"

import { NodeCardDialog } from "../nodes/exports"

import { UserAvatar } from "../users/exports"

type ShapeInfoButtonsProps = {
  excalEl: ExcalidrawElement
}

export function ShapeInfoButtons({
  excalEl,
}: ShapeInfoButtonsProps) {
  const { nodes, excalAppState } = useCanvas()

  if (excalEl.isDeleted) return
  if (excalEl.type === "text" && excalEl.containerId) return

  function getXY() {
    const zoom = excalAppState.zoom.value
    if (excalEl.type === "arrow") {
      const lastPoint = Array.from(
        excalEl.points,
      ).last() as Point

      return [
        excalEl.x +
          lastPoint.first() +
          excalAppState.scrollX,
        excalEl.y +
          lastPoint.second() +
          excalAppState.scrollY,
      ].map((n) => n * zoom)
    } else {
      return [
        excalEl.x +
          excalAppState.scrollX +
          excalEl.width -
          40,
        excalEl.y + excalAppState.scrollY + excalEl.height,
      ].map((n) => n * zoom)
    }
  }

  const [x, y] = getXY()

  const node = nodes[excalEl.id]
  const voteTotal = node?.stats?.voteTotal ?? 0

  return (
    <section
      className="flex gap-1 items-center"
      style={{
        position: "fixed",
        zIndex: 10,
        left: x,
        top: y,
      }}
    >
      <UserAvatar excalEl={excalEl} />
      <NodeCardDialog
        excalEl={excalEl}
        voteTotal={voteTotal}
      />
    </section>
  )
}
