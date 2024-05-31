"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"

import {
  type SelectCanvas,
  type WithReactChildren,
} from "@types"

import { getCanvases } from "@actions"

type CanvasesContext = {
  canvases: SelectCanvas[]
  setCanvases: React.Dispatch<
    React.SetStateAction<SelectCanvas[]>
  >
}

const CanvasesContext =
  createContext<CanvasesContext | null>(null)

export function CanvasesProvider({
  children,
}: WithReactChildren) {
  const [canvases, setCanvases] = useState<SelectCanvas[]>(
    [],
  )

  useEffect(() => {
    async function getCanvasesData() {
      const canvasesData = await getCanvases()

      if (canvasesData) setCanvases(canvasesData)
    }

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    getCanvasesData()
  }, [])

  return (
    <CanvasesContext.Provider
      value={{ canvases, setCanvases }}
    >
      {children}
    </CanvasesContext.Provider>
  )
}

export function useCanvases() {
  const context = useContext(CanvasesContext)

  if (!context)
    throw new Error(
      "`useCanvases` must be used within a `CanvasesProvider`.",
    )

  return context
}
