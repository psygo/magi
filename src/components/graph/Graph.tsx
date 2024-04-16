"use client"

import { useCallback, useEffect, useRef } from "react"

import { useGraph } from "@context"

import { NodeForm } from "./NodeForm"

const rectWidth = 180
const rectHeight = 90

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
  const { nodes, setIsCreatingNode, setCoords } = useGraph()

  const drawNode = useCallback(
    (x: number, y: number) => {
      const ctx = getCtx()

      ctx.rect(x, y, rectWidth, rectHeight)
      ctx.fillStyle = "#fff"
      ctx.fill()
    },
    [getCtx],
  )

  const drawInitialNodes = useCallback(() => {
    nodes.forEach((n) => {
      drawNode(n.x, n.y)
    })
  }, [drawNode, nodes])

  function drawClickedNode(
    e: React.MouseEvent<HTMLCanvasElement>,
  ) {
    setIsCreatingNode(true)

    const [x, y] = [e.clientX, e.clientY]
    setCoords({ x, y })

    drawNode(x, y)
  }

  function highlightNode(
    e: React.MouseEvent<HTMLCanvasElement>,
  ) {
    const [x, y] = [e.clientX, e.clientY]

    nodes.forEach((n) => {
      const ctx = getCtx()
      ctx.beginPath()
      ctx.rect(n.x, n.y, rectWidth, rectHeight)

      ctx.fillStyle = ctx.isPointInPath(x, y)
        ? "red"
        : "blue"
      ctx.fill()
    })
  }

  useEffect(() => {
    drawInitialNodes()
  }, [drawInitialNodes])

  return {
    canvasRef,
    drawClickedNode,
    highlightNode,
  }
}

export function Graph() {
  const { canvasRef, drawClickedNode, highlightNode } =
    useDraw()

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
