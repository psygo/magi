"use client"

import { useDrawNodes } from "@hooks"

import { NodeForm } from "./NodeForm"

export function Graph() {
  const { canvasRef, drawClickedNode, highlightNode } =
    useDrawNodes()

  return (
    <>
      <NodeForm />
      <canvas
        ref={canvasRef}
        className="w-screen h-screen"
        onClick={drawClickedNode}
        onMouseMove={highlightNode}
      ></canvas>
    </>
  )
}
