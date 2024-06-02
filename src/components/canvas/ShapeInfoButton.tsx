"use client"

import { useState } from "react"

import { useUser as useClerkUser } from "@clerk/nextjs"

import { type ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types"

import "@utils/array"

import { type Point } from "@types"

import { NodeProvider, useCanvas } from "@providers"

import { cn, pointsColor } from "@styles"

import { Button, Card } from "@shad"

import { NodePopoverContent } from "../nodes/NodePopover"

import { UserAvatar } from "../users/exports"

type ShapeInfoButtonsProps = {
  excalEl: ExcalidrawElement
}

export function ShapeInfoButtons({
  excalEl,
}: ShapeInfoButtonsProps) {
  const { user } = useClerkUser()

  const { nodes, excalAppState } = useCanvas()
  const node = nodes[excalEl.id]
  const voteTotal = node?.stats?.voteTotal ?? 0

  const [isHovered, setIsHovered] = useState(false)
  const [showUser, setShowUser] = useState(false)

  const [showNodePopover, setShowNodePopover] =
    useState(false)

  if (excalEl.isDeleted) return
  if (excalEl.type === "text" && excalEl.containerId) return

  const zoom = excalAppState.zoom.value

  function getXY() {
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
        excalEl.y +
          excalAppState.scrollY +
          excalEl.height +
          5,
      ].map((n) => n * zoom)
    }
  }

  const [x, y] = getXY()

  return (
    <div
      className="flex gap-1 items-center shadow-md border-gray-500 hover:border-2 rounded-md bg-gray-200 dark:bg-gray-600"
      style={{
        position: "fixed",
        zIndex: isHovered ? 50 : 5,
        left: x,
        top: y,
        height: 32 * zoom,
        paddingLeft: 6 * zoom,
        paddingRight: 4 * zoom,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button onClick={() => setShowUser(!showUser)}>
        <UserAvatar
          username={
            node?.creator?.username ?? user?.username
          }
          imageUrl={
            node?.creator?.imageUrl ?? user?.imageUrl
          }
          zoom={zoom}
        />
      </button>
      {showUser && (
        <div
          className="flex gap-1 items-center shadow-md border-gray-500 hover:border-2 rounded-md bg-gray-200 dark:bg-gray-600"
          style={{
            position: "fixed",
            zIndex: isHovered ? 50 : 5,
            left: x,
            top: y! + 40 * zoom,
            paddingLeft: 10,
            paddingRight: 10,
          }}
        >
          User
        </div>
      )}

      <Button
        variant="link"
        className={cn(
          "p-0 px-[2px] font-bold text-base",
          pointsColor(voteTotal),
        )}
        style={{ fontSize: 20 * zoom }}
        onClick={() => setShowNodePopover(!showNodePopover)}
      >
        {voteTotal}
      </Button>

      {showNodePopover && (
        <NodeProvider excalId={node!.excalId}>
          <Card
            className="overflow-x-auto max-h-[400px]"
            style={{
              position: "fixed",
              left: x! + 60 * zoom,
              top: y!,
              zIndex: 100,
            }}
          >
            <NodePopoverContent />
          </Card>
        </NodeProvider>
      )}
      {/* <NodeModal excalId={excalEl.id} /> */}
    </div>
  )
}
