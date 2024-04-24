"use client"

import { useMemo, useState } from "react"

import dynamic from "next/dynamic"

import { type ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types/types"

import { toDate } from "@utils"

import { LoadingState } from "@types"

import { postNodes } from "@actions"

import {
  nodesArrayToRecords,
  useCanvas,
  useTheme,
} from "@context"

import { Progress } from "@components"

import { ShapeInfoButtons } from "./ShapeInfoButton"

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
  const [loading, setLoading] = useState(
    LoadingState.NotYet,
  )

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

          const appState = excalidrawAPI!.getAppState()
          setExcalAppState(appState)

          setLoading(
            appState.isLoading
              ? LoadingState.Loading
              : LoadingState.Loaded,
          )

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

  function delayedExcalUpdate() {
    // The delay here is used because apparently the
    // snapping of the arrow is not done immediately.
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    setTimeout(async () => {
      await onExcalUpdate()
    }, 100)
  }

  return (
    <div>
      <section
        className="absolute top-0 w-screen h-screen"
        onPointerUp={delayedExcalUpdate}
        onKeyUp={delayedExcalUpdate}
      >
        {Excal}
      </section>
      <section>
        {loading === LoadingState.Loaded &&
          excalElements.length > 0 &&
          excalElements.map((exEl, i) => {
            if (exEl.isDeleted) return

            const zoom = excalAppState.zoom.value
            const [x, y] = [
              exEl.x +
                excalAppState.scrollX +
                exEl.width -
                25,
              exEl.y + excalAppState.scrollY + exEl.height,
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
      </section>
    </div>
  )
}
