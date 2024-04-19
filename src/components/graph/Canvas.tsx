"use client"

import { useMemo, useState } from "react"

import dynamic from "next/dynamic"

import { type ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types/types"

import { useCanvas, useTheme } from "@context"

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

export function Canvas() {
  const { theme } = useTheme()

  const {
    excalElements,
    setExcalElements,
    excalAppState,
    setExcalAppState,
  } = useCanvas()

  const [excalidrawAPI, setExcalidrawAPI] =
    useState<ExcalidrawImperativeAPI>()

  const Excal = useMemo(() => {
    return (
      <Excalidraw
        initialData={{
          elements: excalElements,
          appState: excalAppState,
          scrollToContent: true,
        }}
        theme={theme}
        excalidrawAPI={(api) => setExcalidrawAPI(api)}
        onChange={() => {
          const els = excalidrawAPI?.getSceneElements()
          setExcalAppState(excalidrawAPI?.getAppState())

          if (els) setExcalElements([...els])
        }}
      />
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [excalidrawAPI, theme])

  return (
    <div className="absolute top-0 w-screen h-screen">
      <div>
        {excalElements.length > 0 &&
        excalAppState!.scrollX &&
        excalAppState!.scrollY
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
                  Btn
                </Button>
              )
            })
          : null}
      </div>
      {Excal}
    </div>
  )
}
