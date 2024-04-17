"use client"

import { type MouseEvent } from "react"

import { type Color } from "@types"

import { useGraph } from "@context"

import { useCanvas } from "@hooks"

import {
  borderRadius,
  rectHeight,
  rectWidth,
} from "@styles"

export function useHightlighNodes() {
  const { getCtx } = useCanvas()
  const { nodes, isPointOnNode } = useGraph()

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

  return { highlightNode }
}
