"use client"

import { useMemo, useState } from "react"

import { Excalidraw } from "@excalidraw/excalidraw"
import {
  type NonDeletedExcalidrawElement,
  type ExcalidrawElement,
} from "@excalidraw/excalidraw/types/element/types"
import { type ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types/types"
import { type ImportedDataState } from "@excalidraw/excalidraw/types/data/types"

import { Button } from "@shad"

export function Graph() {
  const [exEls, setExEls] = useState<
    ExcalidrawElement[] | NonDeletedExcalidrawElement[]
  >([])
  const [excalidrawAPI, setExcalidrawAPI] =
    useState<ExcalidrawImperativeAPI>()
  const [appState, setAppState] =
    useState<ImportedDataState["appState"]>()

  const Excal = useMemo(() => {
    return (
      <Excalidraw
        excalidrawAPI={(api) => setExcalidrawAPI(api)}
        onChange={() => {
          const els = excalidrawAPI?.getSceneElements()
          setAppState(excalidrawAPI?.getAppState())

          if (els) setExEls([...els])
        }}
      />
    )
  }, [excalidrawAPI])

  return (
    <div className="absolute top-0 w-screen h-screen">
      <div>
        {exEls.length > 0
          ? exEls.map((exEl, i) => {
              const zoom = appState!.zoom!.value
              const [x, y] = [
                exEl.x + appState!.scrollX! + exEl.width,
                exEl.y + appState!.scrollY! + exEl.height,
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
