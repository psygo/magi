"use client"

import { useCallback, useEffect } from "react"

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
    const ctx = getCtx()

    nodes.forEach((n) => {
      ctx.beginPath()
      ctx.roundRect(
        n.x,
        n.y,
        rectWidth,
        rectHeight,
        borderRadius,
      )

      const pointIsWithinX =
        x >= n.x && x <= n.x + rectWidth
      const pointIsWithinY =
        y >= n.y && y <= n.y + rectHeight
      const pointIsInPath = pointIsWithinX && pointIsWithinY

      pointIsInPath
        ? (ctx.fillStyle = "red")
        : (ctx.fillStyle = "white")

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
