"use client"

import { useUser } from "@clerk/nextjs"

import { type ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types"

import "@utils/array"

import { type Point } from "@types"

import { useCanvas } from "@context"

import { NodeModal } from "../nodes/exports"

import { UserAvatar } from "../users/exports"

type ShapeInfoButtonsProps = {
  excalEl: ExcalidrawElement
}

export function ShapeInfoButtons({
  excalEl,
}: ShapeInfoButtonsProps) {
  const { user } = useUser()

  const { nodes, excalAppState } = useCanvas()
  const node = nodes[excalEl.id]

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
        excalEl.y + excalAppState.scrollY + excalEl.height,
      ].map((n) => n * zoom)
    }
  }

  const [x, y] = getXY()

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
      <UserAvatar
        username={node?.creator?.username ?? user?.username}
        imageUrl={node?.creator?.imageUrl ?? user?.imageUrl}
        zoom={zoom}
      />
      <NodeModal excalEl={excalEl} />
    </section>
  )
}
