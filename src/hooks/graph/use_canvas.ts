"use client"

import { useCallback, useEffect, useRef } from "react"

export function useCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  function getCanvas() {
    return canvasRef.current!
  }

  const getCtx = useCallback(() => {
    const canvas = getCanvas()
    if (canvas) return canvas.getContext("2d")!
  }, [])

  const setupCanvasScale = useCallback(() => {
    const scale = window.devicePixelRatio
    const canvas = getCanvas()

    if (!canvas) return

    const width = window.innerWidth
    const height = window.innerHeight

    canvas.width = width * scale
    canvas.height = height * scale

    const ctx = getCtx()
    ctx?.scale(scale, scale)
  }, [getCtx])

  useEffect(() => {
    setupCanvasScale()
  }, [setupCanvasScale])

  return { canvasRef, getCanvas, getCtx }
}
