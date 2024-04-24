"use client"

import { useState } from "react"

import { type ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types"

import { postVote } from "@actions"

import { useCanvas } from "@context"

import { cn, pointsColor } from "@styles"

import { NodeCardDialog } from "../nodes/exports"
import { VoteButton } from "../votes/exports"

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

  const [voteTotal, setVoteTotal] = useState(
    node?.stats?.voteTotal ?? 0,
  )

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
      <NodeCardDialog excalEl={excalEl} />
      <VoteButton
        up
        onClick={async () => {
          await postVote(excalEl.id, true)
          setVoteTotal(voteTotal + 1)
        }}
      />
      <VoteButton
        onClick={async () => {
          await postVote(excalEl.id, false)
          setVoteTotal(voteTotal - 1)
        }}
      />
      <p
        className={cn(
          "px-[2px] font-bold",
          pointsColor(voteTotal),
        )}
      >
        {voteTotal}
      </p>
    </div>
  )
}
