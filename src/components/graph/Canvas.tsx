"use client"

import { useMemo, useState } from "react"

import dynamic from "next/dynamic"

import { ArrowDown, ArrowUp, Info } from "lucide-react"

import { type ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types"
import { type ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types/types"

import { toDate } from "@utils"

import { type ExcalId } from "@types"

import { postNodes, postVote } from "@actions"

import {
  nodesArrayToRecords,
  useCanvas,
  useTheme,
} from "@context"

import { Button } from "@shad"

import { Progress } from "@components"
import { cn } from "../../styles/cn"

const Excalidraw = dynamic(
  async () => {
    const mod = await import("@excalidraw/excalidraw")
    return mod.Excalidraw
  },
  {
    loading: () => <Progress />,
    ssr: false,
  },
)

export function Canvas() {
  const { theme } = useTheme()

  const [excalidrawAPI, setExcalidrawAPI] =
    useState<ExcalidrawImperativeAPI>()

  const {
    nodes,
    setNodes,
    excalElements,
    setExcalElements,
    excalAppState,
    setExcalAppState,
  } = useCanvas()

  const [lastUpdated, setLastUpdated] = useState<Date>(
    new Date(),
  )

  const Excal = useMemo(() => {
    return (
      <Excalidraw
        initialData={{
          elements: excalElements,
          appState: excalAppState,
          scrollToContent: true,
        }}
        theme={theme}
        excalidrawAPI={(api) => {
          setExcalidrawAPI(api)
        }}
        onChange={() => {
          const els =
            excalidrawAPI?.getSceneElementsIncludingDeleted()
          setExcalAppState(excalidrawAPI!.getAppState())

          if (els) setExcalElements([...els])
        }}
      />
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [excalidrawAPI, theme])

  async function onExcalUpdate() {
    const notUpdatedYet = excalElements.filter(
      (el) => toDate(el.updated) > lastUpdated,
    )

    console.log(notUpdatedYet)

    if (notUpdatedYet.length > 0) {
      const newNodes = await postNodes(notUpdatedYet)

      if (newNodes) {
        const newNodesRecords =
          nodesArrayToRecords(newNodes)
        setNodes({
          ...nodes,
          ...newNodesRecords,
        })

        setLastUpdated(new Date())
      }
    }
  }

  return (
    <div>
      <div
        className="absolute top-0 w-screen h-screen"
        onPointerUp={onExcalUpdate}
        onKeyUp={onExcalUpdate}
      >
        {Excal}
      </div>
      <div>
        {excalElements.length > 0 &&
          excalElements.map((exEl, i) => {
            const zoom = excalAppState.zoom.value
            const [x, y] = [
              exEl.x + excalAppState.scrollX - 15,
              exEl.y +
                excalAppState.scrollY +
                exEl.height -
                10,
            ].map((n) => n * zoom)

            return (
              <ShapeInfoButtons
                key={i}
                x={x!}
                y={y!}
                excalEl={exEl}
              />
            )
          })}
      </div>
    </div>
  )
}

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

type VoteButtonProps = {
  up?: boolean
  excalId: ExcalId
}

export function VoteButton({
  up = false,
  excalId,
}: VoteButtonProps) {
  const [hovered, setHovered] = useState(false)

  async function handleClick() {
    await postVote(excalId, up)
  }

  return (
    <Button
      variant="link"
      className="p-0 m-0"
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {up ? (
        <ArrowUp
          className="h-4 w-4"
          style={{ color: hovered ? "red" : "" }}
        />
      ) : (
        <ArrowDown
          className="h-4 w-4"
          style={{ color: hovered ? "red" : "" }}
        />
      )}
    </Button>
  )
}
