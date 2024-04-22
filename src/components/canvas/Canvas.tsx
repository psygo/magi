"use client"

import { useMemo, useState } from "react"

import dynamic from "next/dynamic"

import { type ExcalidrawArrowElement } from "@excalidraw/excalidraw/types/element/types"
import { type ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types/types"

import { toDate } from "@utils"

import {
  type EdgesRecords,
  type SelectEdgeWithCreatorAndStats,
} from "@types"

import { postEdges, postNodes } from "@actions"

import {
  nodesOrEdgesArrayToRecords,
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

  const {
    nodes,
    setNodes,
    edges,
    setEdges,
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
    const notUpdatedYetNodes = notUpdatedYet.filter(
      (n) => n.type !== "arrow",
    )
    const notUpdatedYetEdges = notUpdatedYet.filter(
      (n) => n.type === "arrow",
    ) as ExcalidrawArrowElement[]

    if (notUpdatedYetNodes.length > 0) {
      const newNodes = await postNodes(notUpdatedYetNodes)

      if (newNodes) {
        const newNodesRecords =
          nodesOrEdgesArrayToRecords(newNodes)

        setNodes({
          ...nodes,
          ...newNodesRecords,
        })

        setLastUpdated(new Date())
      }
    }
    if (notUpdatedYetEdges.length > 0) {
      const newEdges = await postEdges(notUpdatedYetEdges)

      if (newEdges) {
        const newEdgesRecords = nodesOrEdgesArrayToRecords<
          SelectEdgeWithCreatorAndStats,
          EdgesRecords
        >(newEdges)

        setEdges({
          ...edges,
          ...newEdgesRecords,
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
      <div
        className="absolute top-0 w-screen h-screen"
        onPointerUp={delayedExcalUpdate}
        onKeyUp={delayedExcalUpdate}
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
