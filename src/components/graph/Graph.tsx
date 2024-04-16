"use client"

import { useCallback, useEffect, useRef } from "react"

import { useGraph } from "@context"

import { NodeForm } from "./NodeForm"

function useScale() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  function getCanvas() {
    return canvasRef.current!
  }

  const getCtx = useCallback(() => {
    const canvas = getCanvas()
    return canvas.getContext("2d")!
  }, [])

  const setupCanvasScale = useCallback(() => {
    const scale = window.devicePixelRatio
    const canvas = getCanvas()

    const width = window.innerWidth
    const height = window.innerHeight

    canvas.width = width * scale
    canvas.height = height * scale

    const ctx = getCtx()
    ctx.scale(scale, scale)
  }, [getCtx])

  useEffect(() => {
    setupCanvasScale()
  }, [setupCanvasScale])

  return { canvasRef, getCanvas, getCtx }
}

function useDraw() {
  const { canvasRef, getCtx } = useScale()
  const { setIsCreatingNode } = useGraph()

  function drawNode(
    e: React.MouseEvent<HTMLCanvasElement>,
  ) {
    setIsCreatingNode(true)

    const [x, y] = [e.clientX, e.clientY]
    const ctx = getCtx()

    ctx.rect(x, y, 180, 90)
    ctx.fillStyle = "#fff"
    ctx.fill()
  }

  return {
    canvasRef,
    drawNode,
  }
}

export function Graph() {
  const { canvasRef, drawNode } = useDraw()

  return (
    <>
      <NodeForm />
      <canvas
        ref={canvasRef}
        className="w-screen h-screen"
        onClick={drawNode}
      ></canvas>
    </>
  )
}
