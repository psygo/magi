"use client"

import { useEffect, useState } from "react"

import { type SelectCanvas } from "../types/canvases"

import { getCanvases } from "@actions"

export function useCanvases() {
  const [canvases, setCanvases] = useState<SelectCanvas[]>()

  useEffect(() => {
    async function getCanvasesData() {
      const canvasesData = await getCanvases()

      console.log("canvases data", canvasesData)

      if (canvasesData) setCanvases(canvasesData)
    }

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    getCanvasesData()
  }, [])

  return { canvases, setCanvases }
}
