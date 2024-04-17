"use client"

import {
  type MouseEvent,
  useCallback,
  useEffect,
} from "react"

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

    for (const n of nodes) {
      ctx.beginPath()
      ctx.roundRect(
        n.x,
        n.y,
        rectWidth,
        rectHeight,
        borderRadius,
      )

      if (isPointOnNode(x, y, n.x, n.y)) {
        ctx.fillStyle = "red"
        ctx.fill()
        break
      } else {
        ctx.fillStyle = "white"
        ctx.fill()
      }
    }
  }

  function dragNode(e: MouseEvent<HTMLCanvasElement>) {
    const [x, y] = [e.clientX, e.clientY]
  }

  function isPointOnNode(
    x: number,
    y: number,
    nodeX: number,
    nodeY: number,
  ) {
    const pointIsWithinX =
      x >= nodeX && x <= nodeX + rectWidth
    const pointIsWithinY =
      y >= nodeY && y <= nodeY + rectHeight
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
