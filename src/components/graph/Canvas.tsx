"use client"

import { useMemo, useState } from "react"

import dynamic from "next/dynamic"

import { type ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types/types"
import { type ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types"

import "@utils/array"

import { toDate } from "@utils"

import { type ExcalAppState } from "@types"

import { type SelectNode } from "@server"

import { defaultInitialData, useTheme } from "@context"

import { Button } from "@shad"

import { Progress } from "@components"

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
          const els = excalidrawAPI?.getSceneElements()
          setExcalAppState(excalidrawAPI?.getAppState())

          if (els) setExcalElements([...els])
        }}
      />
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [excalidrawAPI, theme])

  function onExcalUpdate() {
    const notUpdatedYet = excalElements.filter(
      (el) => toDate(el.updated) > lastUpdated,
    )

    if (notUpdatedYet.length > 0) {
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
        {excalElements.length > 0
          ? excalElements.map((exEl, i) => {
              const zoom = excalAppState!.zoom!.value
              const [x, y] = [
                exEl.x +
                  excalAppState!.scrollX! +
                  exEl.width,
                exEl.y +
                  excalAppState!.scrollY! +
                  exEl.height,
              ].map((n) => n * zoom)

              return (
                <Button
                  key={i}
                  style={{
                    position: "absolute",
                    zIndex: 50,
                    left: x,
                    top: y,
                  }}
                >
                  B
                </Button>
              )
            })
          : null}
      </div>
    </div>
  )
}
