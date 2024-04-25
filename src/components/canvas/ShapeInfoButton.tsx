"use client"

import { type ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types"

import { useCanvas } from "@context"

import { NodeCardDialog } from "../nodes/exports"

type ShapeInfoButtonsProps = {
  x: number
  y: number
  excalEl: ExcalidrawElement
}

export function ShapeInfoButtons({
  x,
  y,
  excalEl,
}: ShapeInfoButtonsProps) {
  const { nodes } = useCanvas()
  const node = nodes[excalEl.id]
  const voteTotal = node?.stats?.voteTotal ?? 0

  return (
    <div
      className="flex gap-1 items-center"
      style={{
        position: "absolute",
        zIndex: 10,
        left: x,
        top: y,
      }}
    >
      <NodeCardDialog
        excalEl={excalEl}
        voteTotal={voteTotal}
      />
    </div>
  )
}
