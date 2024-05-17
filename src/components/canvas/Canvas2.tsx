"use client"

import { nanoid } from "nanoid"

import { useMemo, useState } from "react"

import dynamic from "next/dynamic"

import { type Pointer } from "@types"

import {
  useCanvas2,
  useFiles,
  usePagination,
  useShapes,
} from "@context"

import { Progress } from "../common/exports"

import { AccountButton } from "../users/exports"

import { Coordinates } from "./Coordinates"

const Excalidraw = dynamic(
  async () => {
    const mod = await import("@excalidraw/excalidraw")
    return mod.Excalidraw
  },
  {
    loading: () => <Progress />,
    ssr: false,
  },
)

export function Canvas2() {
  const {
    excalidrawAPI,
    setExcalidrawAPI,
    excalElements,
    setExcalElements,
    excalAppState,
    setExcalAppState,
  } = useCanvas2()

  const { debouncedScrollAndZoom } = usePagination()

  const { setIsDragging } = useShapes()

  const { setFiles } = useFiles()

  const [pointer, setPointer] = useState<Pointer>({
    x: 0,
    y: 0,
  })

  const PointerCoords = useMemo(
    () => <Coordinates x={pointer.x} y={pointer.y} />,
    [pointer],
  )

  const Excal = useMemo(() => {
    return (
      <Excalidraw
        name="Magi"
        UIOptions={{
          canvasActions: {
            clearCanvas: false,
            toggleTheme: true,
          },
        }}
        gridModeEnabled
        renderTopRightUI={() => <AccountButton />}
        initialData={{
          elements: excalElements,
          appState: excalAppState,
        }}
        excalidrawAPI={(api) => setExcalidrawAPI(api)}
        onPointerUpdate={({ pointer }) =>
          setPointer(pointer)
        }
        onScrollChange={async () => {
          const appState = excalidrawAPI!.getAppState()
          debouncedScrollAndZoom({
            scrollX: appState.scrollX,
            scrollY: appState.scrollY,
            zoom: appState.zoom.value,
          })
        }}
        generateIdForFile={(f) => {
          const ext = f.type.split("/").second()
          return `${nanoid()}.${ext}`
        }}
        onChange={(elements, appState, files) => {
          if (appState.pendingImageElementId) return

          appState.draggingElement
            ? setIsDragging(true)
            : setIsDragging(false)

          setExcalElements([...elements])
          setExcalAppState(appState)
          setFiles(files)
        }}
      />
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [excalidrawAPI])

  return (
    <div className="absolute w-screen h-screen">
      {Excal}
      {PointerCoords}
    </div>
  )
}
