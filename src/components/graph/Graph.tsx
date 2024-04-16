"use client"

import { useCallback, useEffect, useRef } from "react"

function useSetup() {
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
    const ctx = getCtx()
    ctx.scale(scale, scale)
  }, [getCtx])

  useEffect(() => {
    setupCanvasScale()
  }, [setupCanvasScale])

  return { canvasRef, getCanvas, getCtx }
}

export function Graph() {
  const { canvasRef } = useSetup()

  return (
    <canvas
      ref={canvasRef}
      className="w-screen h-screen"
    ></canvas>
  )
}
