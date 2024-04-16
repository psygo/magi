"use client"

import { useCallback, useEffect, useRef } from "react"

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

  function drawRect(
    e: React.MouseEvent<HTMLCanvasElement>,
  ) {
    const [x, y] = [e.clientX, e.clientY]
    const ctx = getCtx()

    ctx.rect(x, y, 20, 10)
    ctx.fillStyle = "#fff"
    ctx.fill()
  }

  return { canvasRef, drawRect }
}

export function Graph() {
  const { canvasRef, drawRect } = useDraw()

  return (
    <canvas
      ref={canvasRef}
      className="w-screen h-screen"
      onClick={drawRect}
    ></canvas>
  )
}
