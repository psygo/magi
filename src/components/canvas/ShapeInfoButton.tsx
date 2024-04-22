"use client"

import { type ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types"

import { useCanvas } from "@context"

import { cn } from "@styles"

import { VoteButton } from "./VoteButton"
import { NodeCardDialog } from "./NodeCardDialog"

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
        left: x - 32,
        top: y,
      }}
    >
      <NodeCardDialog
        excalId={excalEl.id}
        isNode={excalEl.type !== "arrow"}
      />
      <VoteButton excalId={excalEl.id} up />
      <VoteButton excalId={excalEl.id} />
      <p
        className={cn(
          "px-[2px] font-bold",
          voteTotal >= 0
            ? "text-green-700"
            : "text-red-400",
        )}
      >
        {voteTotal}
      </p>
    </div>
  )
}
