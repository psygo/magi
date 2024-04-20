"use client"

import { useMemo, useState } from "react"

import dynamic from "next/dynamic"

import { type ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types/types"
import { type ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types"

import "@utils/array"

import { toDate } from "@utils"

import { type ExcalAppState } from "@types"

import { type SelectNode } from "@server"

import { postNode } from "@actions"

import { defaultInitialData, useTheme } from "@context"

import { Button } from "@shad"

import { Progress } from "@components"
import { ArrowDown, ArrowUp, Info } from "lucide-react"

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

type CanvasProps = {
  initialNodes?: SelectNode[]
}

export function Canvas({ initialNodes = [] }: CanvasProps) {
  const { theme } = useTheme()

  const [excalidrawAPI, setExcalidrawAPI] =
    useState<ExcalidrawImperativeAPI>()

  const initialElements = initialNodes.map((n) => {
    return n.excalData as ExcalidrawElement
  })
  const initialAppState = defaultInitialData.appState

  const [excalElements, setExcalElements] =
    useState<ExcalidrawElement[]>(initialElements)
  const [excalAppState, setExcalAppState] =
    useState<ExcalAppState>(defaultInitialData.appState)

  const [lastUpdated, setLastUpdated] = useState<Date>(
    new Date(),
  )

  const Excal = useMemo(() => {
    return (
      <Excalidraw
        initialData={{
          elements: initialElements,
          appState: initialAppState,
          scrollToContent: true,
        }}
        theme={theme}
        excalidrawAPI={(api) => {
          setExcalidrawAPI(api)
        }}
        onChange={() => {
          const els =
            excalidrawAPI?.getSceneElementsIncludingDeleted()
          setExcalAppState(excalidrawAPI?.getAppState())

          if (els) setExcalElements([...els])
        }}
      />
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [excalidrawAPI, theme])

  async function onExcalUpdate() {
    const notUpdatedYet = excalElements
      .filter((el) => toDate(el.updated) > lastUpdated)
      .first()

    if (notUpdatedYet) {
      const newNodeData = await postNode(
        "",
        "",
        notUpdatedYet,
      )
      // always post but then select distinct id ordered by
      // date when getting the data back?

      setLastUpdated(new Date())
    }
  }

  return (
    <div>
      <div
        className="absolute top-0 w-screen h-screen"
        onPointerUp={onExcalUpdate}
      >
        {Excal}
      </div>
      <div>
        {excalElements.length > 0 &&
          excalElements.map((exEl, i) => {
            const zoom = excalAppState!.zoom!.value
            const [x, y] = [
              exEl.x + excalAppState!.scrollX! - 15,
              exEl.y +
                excalAppState!.scrollY! +
                exEl.height -
                10,
            ].map((n) => n * zoom)

            return (
              <ShapeInfoButtons key={i} x={x!} y={y!} />
            )
          })}
      </div>
    </div>
  )
}

type ShapeInfoButtonsProps = {
  x: number
  y: number
}

export function ShapeInfoButtons({
  x,
  y,
}: ShapeInfoButtonsProps) {
  return (
    <div className="flex gap-1">
      <Button
        variant="link"
        className="p-0 m-0"
        style={{
          position: "absolute",
          zIndex: 50,
          left: x - 32,
          top: y,
        }}
      >
        <Info className="h-[13px] w-[13px]" />
      </Button>
      <Button
        variant="link"
        className="p-0 m-0"
        style={{
          position: "absolute",
          zIndex: 50,
          left: x - 16,
          top: y,
        }}
      >
        <ArrowUp className="h-4 w-4" />
      </Button>
      <Button
        variant="link"
        className="p-0 m-0"
        style={{
          position: "absolute",
          zIndex: 50,
          left: x,
          top: y,
        }}
      >
        <ArrowDown className="h-4 w-4" />
      </Button>
    </div>
  )
}
