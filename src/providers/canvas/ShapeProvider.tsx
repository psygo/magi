"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"

import { useParams } from "next/navigation"

import { useUser as useClerkUser } from "@clerk/nextjs"

import { type ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types"

import { toDate } from "@utils"

import { type WithReactChildren } from "@types"

import { postNodes } from "@actions"

import { useLocalStorage } from "@hooks"

import { useCanvas } from "./CanvasProvider"

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
  const params = useParams()

  const { isSignedIn } = useClerkUser()

  const { excalElements } = useCanvas()

  const [lastUpdatedShapes, setLastUpdatedShapes] =
    useState<Date>(new Date())

  const { get: getIsDragging, set: setIsDragging } =
    useLocalStorage("isDragging", false)

  const {
    get: getIsUploadingShape,
    set: setIsUploadingShape,
  } = useLocalStorage("isUploadingShape", false)

  async function uploadShape(els: ExcalidrawElement[]) {
    const isUploadingShape = getIsUploadingShape()
    const isDragging = getIsDragging()
    if (isUploadingShape || isDragging) return

    setIsUploadingShape(true)
    const newNodes = await postNodes(
      els,
      (params.canvas_id as string) ?? "open-canvas",
    )
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

  if (!context)
    throw new Error(
      "`useShapes` must be used within a `ShapeProvider`.",
    )

  return context
}
