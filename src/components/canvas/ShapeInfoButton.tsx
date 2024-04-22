"use client"

import { Info } from "lucide-react"

import { type ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types"

import { useCanvas } from "@context"

import { Button } from "@shad"

import { cn } from "@styles"

import { VoteButton } from "./VoteButton"

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
        zIndex: 50,
        left: x - 32,
        top: y,
      }}
    >
      <Button variant="link" className="p-0 m-0">
        <Info className="h-[13px] w-[13px]" />
      </Button>
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
