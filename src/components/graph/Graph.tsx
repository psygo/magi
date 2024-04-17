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
        className="w-screen h-screen"
        onClick={drawClickedNode}
        onMouseMove={highlightNode}
      ></canvas>
    )
  }, [canvasRef, drawClickedNode, highlightNode])

  return (
    <>
      <NodeForm />
      {Canvas}
    </>
  )
}
