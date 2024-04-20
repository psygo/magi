"use client"

import { useMemo, useState } from "react"

import dynamic from "next/dynamic"

import { ArrowDown, ArrowUp, Info } from "lucide-react"

import { type ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types/types"

import { toDate } from "@utils"

import { postNodes, postVote } from "@actions"

import { useCanvas, useTheme } from "@context"

import { Button } from "@shad"

import { Progress } from "@components"
import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types"
import { ExcalId } from "../../types/id"

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

    if (notUpdatedYet.length > 0) {
      await postNodes(notUpdatedYet)

      setLastUpdated(new Date())
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
  return (
    <div
      className="flex gap-1"
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
      <VoteButton excalId={excalEl.id} up={true} />
      <VoteButton excalId={excalEl.id} />
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

  return (
    <Button
      variant="link"
      className="p-0 m-0"
      onClick={async () => await postVote(excalId, up)}
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
