"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"

import { useUser as useClerkUser } from "@clerk/nextjs"

import { type ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types"

import { toDate } from "@utils"

import { type WithReactChildren } from "@types"

import { postNodes } from "@actions"

import { useCanvas2 } from "./CanvasProvider"

type ShapesContext = {
  setIsDragging: (v: boolean) => void
  uploadShape: (els: ExcalidrawElement[]) => Promise<void>
}

const ShapesContext = createContext<ShapesContext | null>(
  null,
)

type ShapesProviderProps = WithReactChildren

export function ShapesProvider({
  children,
}: ShapesProviderProps) {
  const { isSignedIn } = useClerkUser()

  const { excalElements } = useCanvas2()

  const [lastUpdatedShapes, setLastUpdatedShapes] =
    useState<Date>(new Date())

  const [isDragging, setIsDragging] = useState(false)

  const [isUploadingShape, setIsUploadingShape] =
    useState(false)

  async function uploadShape(els: ExcalidrawElement[]) {
    if (isUploadingShape || isDragging) return

    setIsUploadingShape(true)
    const newNodes = await postNodes(els)
    setIsUploadingShape(false)

    if (!newNodes) return

    setLastUpdatedShapes(new Date())
  }

  useEffect(() => {
    if (!isSignedIn) return

    setTimeout(() => {
      const notUpdatedYet = excalElements.filter(
        (el) => toDate(el.updated) > lastUpdatedShapes,
      )

      if (notUpdatedYet.length === 0) return

      uploadShape(notUpdatedYet).catch(() =>
        console.error("error"),
      )
    }, 250)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [excalElements, lastUpdatedShapes, isSignedIn])

  return (
    <ShapesContext.Provider
      value={{ setIsDragging, uploadShape }}
    >
      {children}
    </ShapesContext.Provider>
  )
}

export function useShapes() {
  const context = useContext(ShapesContext)

  if (!context) {
    throw new Error(
      "`useShapes` must be used within a `ShapeProvider`.",
    )
  }

  return context
}
