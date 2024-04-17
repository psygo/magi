"use client"

import { useMemo } from "react"

import { useDrawNodes } from "@hooks"

import { NodeForm } from "./NodeForm"

export function Graph() {
  const { canvasRef, drawClickedNode, highlightNode } =
    useDrawNodes()

  const Canvas = useMemo(() => {
    return (
      <canvas
        ref={canvasRef}
        className="absolute top-0 w-screen h-screen"
        onClick={drawClickedNode}
        onMouseMove={highlightNode}
      ></canvas>
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasRef])

  return (
    <>
      <NodeForm />
      {Canvas}
    </>
  )
}
