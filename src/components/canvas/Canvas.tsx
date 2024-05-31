"use client"

import { nanoid } from "nanoid"

import { useMemo, useState } from "react"

import { useUser as useClerkUser } from "@clerk/nextjs"

import { LoadingState, type Pointer } from "@types"

import {
  useCanvas,
  useFiles,
  usePagination,
  usePreferences,
  useShapes,
  useTheme,
} from "@providers"

import { AccountButton } from "../users/exports"

import { CanvasesModal } from "../canvases_modal/exports"

import { CanvasMenu } from "./CanvasMenu"
import { Coordinates } from "./Coordinates"
import { Excalidraw } from "./DynamicExcalidraw"
import { ShapeInfoButtons } from "./ShapeInfoButton"

export function Canvas() {
  /*------------------------------------------------------*/
  /* Providers */

  const { isSignedIn } = useClerkUser()

  const { theme } = useTheme()

  const {
    excalidrawAPI,
    setExcalidrawAPI,
    excalElements,
    setExcalElements,
    excalAppState,
    setExcalAppState,
  } = useCanvas()

  const { showMeta, showCoords, gridModeEnabled } =
    usePreferences()

  const { debouncedScrollAndZoom } = usePagination()

  const { setIsDragging } = useShapes()

  const { setFiles } = useFiles()

  /*------------------------------------------------------*/
  /* Extra UI */

  const [loading, setLoading] = useState(
    LoadingState.NotYet,
  )
  const [pointer, setPointer] = useState<Pointer>({
    x: 0,
    y: 0,
  })

  const PointerCoords = useMemo(
    () => <Coordinates x={pointer.x} y={pointer.y} />,
    [pointer],
  )

  /*------------------------------------------------------*/

  const Excal = useMemo(() => {
    return (
      <Excalidraw
        name="Magi"
        theme={theme}
        UIOptions={{
          canvasActions: {
            clearCanvas: false,
            toggleTheme: true,
          },
        }}
        gridModeEnabled={gridModeEnabled}
        renderTopRightUI={() => (
          <>
            {isSignedIn && <CanvasesModal />}
            <AccountButton />
          </>
        )}
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

          setLoading(
            appState.isLoading
              ? LoadingState.Loading
              : LoadingState.Loaded,
          )
        }}
      >
        <CanvasMenu />
      </Excalidraw>
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    excalidrawAPI,
    theme,
    isSignedIn,
    showMeta,
    gridModeEnabled,
    showCoords,
  ])

  function isLoaded() {
    return loading === LoadingState.Loaded
  }

  return (
    <div className="absolute w-screen h-screen">
      {Excal}
      {isLoaded() && (
        <>
          <section>
            {showMeta &&
              excalElements.map((excalEl, i) => (
                <ShapeInfoButtons
                  key={i}
                  excalEl={excalEl}
                />
              ))}
          </section>
          {showCoords && PointerCoords}
        </>
      )}
    </div>
  )
}
