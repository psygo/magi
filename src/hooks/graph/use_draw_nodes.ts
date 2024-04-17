"use client"

import {
  type MouseEvent,
  useCallback,
  useEffect,
} from "react"

import { type Color } from "@types"

import { useGraph } from "@context"

import { useCanvas } from "@hooks"

import {
  borderRadius,
  rectHeight,
  rectWidth,
} from "@styles"

export function useDrawNodes() {
  const { canvasRef, getCtx } = useCanvas()
  const {
    nodes,
    setIsCreatingNode,
    setCoords,
    isPointOnNode,
    isPointOnAnyNode,
  } = useGraph()

  const drawNode = useCallback(
    (x: number, y: number) => {
      const ctx = getCtx()

      if (!ctx) return

      ctx.roundRect(
        x,
        y,
        rectWidth,
        rectHeight,
        borderRadius,
      )
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
    e: MouseEvent<HTMLCanvasElement>,
  ) {
    const [x, y] = [e.clientX, e.clientY]

    if (isPointOnAnyNode(x, y)) return

    setIsCreatingNode(true)

    setCoords({ x, y })

    drawNode(x, y)
  }

  function highlightNode(e: MouseEvent<HTMLCanvasElement>) {
    const [x, y] = [e.clientX, e.clientY]
    const ctx = getCtx()

    if (!ctx) return

    const hoveredNode = nodes.find((n) =>
      isPointOnNode(x, y, n.x, n.y),
    )

    if (hoveredNode) {
      highlight(hoveredNode.x, hoveredNode.y, "red")
      document.body.style.cursor = "pointer"
    } else {
      document.body.style.cursor = "auto"
    }

    nodes
      .filter((n) =>
        hoveredNode ? n.id !== hoveredNode.id : true,
      )
      .forEach((n) => highlight(n.x, n.y, "white"))
  }

  function highlight(x: number, y: number, color: Color) {
    const ctx = getCtx()
    if (!ctx) return

    ctx.beginPath()
    ctx.roundRect(x, y, rectWidth, rectHeight, borderRadius)
    ctx.fillStyle = color
    ctx.fill()
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
