"use client"

import {
  type MouseEvent,
  useCallback,
  useEffect,
} from "react"

import { type Color } from "@types"

import { useGraph } from "@context"

import { useCanvas } from "@hooks"

const rectWidth = 180
const rectHeight = 90
const borderRadius = 10

export function useDrawNodes() {
  const { canvasRef, getCtx } = useCanvas()
  const { nodes, setIsCreatingNode, setCoords } = useGraph()

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

  function dragNode(e: MouseEvent<HTMLCanvasElement>) {
    const [x, y] = [e.clientX, e.clientY]
    const hoveredNode = nodes.find((n) =>
      isPointOnNode(x, y, n.x, n.y),
    )
  }

  function isPointOnNode(
    x: number,
    y: number,
    nX: number,
    nY: number,
  ) {
    const pointIsWithinX = x >= nX && x <= nX + rectWidth
    const pointIsWithinY = y >= nY && y <= nY + rectHeight
    return pointIsWithinX && pointIsWithinY
  }

  function isPointOnAnyNode(x: number, y: number) {
    return nodes
      .map((n) => isPointOnNode(x, y, n.x, n.y))
      .reduce((p, v) => p || v)
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
