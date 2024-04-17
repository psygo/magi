"use client"

import { useRef } from "react"

import { Excalidraw } from "@excalidraw/excalidraw"
import { type ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types"

export function Graph() {
  const excalidrawDivRef = useRef<HTMLDivElement>(null)

  function getExcalidrawCanvas() {
    const excalidrawCanvas: HTMLCanvasElement =
      excalidrawDivRef.current!.querySelector(
        "canvas.excalidraw__canvas.static",
      )!

    return excalidrawCanvas
  }

  function onChangeEx(exEls: readonly ExcalidrawElement[]) {
    const excalidrawCanvas = getExcalidrawCanvas()
    const ctx = excalidrawCanvas.getContext("2d")!

    const lastEl = exEls[exEls.length - 1]

    if (lastEl) {
      ctx.roundRect(
        lastEl.x + lastEl.width,
        lastEl.y + lastEl.height,
        180,
        90,
        10,
      )
      ctx.fillStyle = "red"
      ctx.fill()
    }
  }

  return (
    <div
      ref={excalidrawDivRef}
      className="absolute top-0 w-screen h-screen"
      onPointerUp={(e) => {
        // Maybe something here could work...
        // console.log(e)
        // const excalidrawCanvas = getExcalidrawCanvas()
      }}
    >
      <Excalidraw onChange={(exEls) => onChangeEx(exEls)} />
    </div>
  )
}
