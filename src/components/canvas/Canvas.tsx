"use client"

import { nanoid } from "nanoid"

import { useMemo, useState } from "react"

import dynamic from "next/dynamic"

import { useUser as useClerkUser } from "@clerk/nextjs"

import { MainMenu } from "@excalidraw/excalidraw"

import {
  Braces,
  Grid3X3,
  Moon,
  Move3D,
  Sun,
  X,
} from "lucide-react"

import { LoadingState, Theme, type Pointer } from "@types"

import {
  useCanvas,
  useFiles,
  usePagination,
  useShapes,
  useTheme,
} from "@providers"

import { saveTheme } from "@actions"

import { Progress } from "../common/exports"

import { AccountButton } from "../users/exports"

import { Coordinates } from "./Coordinates"
import { ShapeInfoButtons } from "./ShapeInfoButton"
import { CanvasModal } from "./CanvasModal"

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

export function Canvas() {
  /*------------------------------------------------------*/
  /* Providers */
  const { isSignedIn } = useClerkUser()

  const { theme, cycleTheme } = useTheme()

  const {
    excalidrawAPI,
    setExcalidrawAPI,
    excalElements,
    setExcalElements,
    excalAppState,
    setExcalAppState,
  } = useCanvas()

  const { debouncedScrollAndZoom } = usePagination()

  const { setIsDragging } = useShapes()

  const { setFiles } = useFiles()

  /*------------------------------------------------------*/
  /* Preferences */

  const [showMeta, setShowMeta] = useState(true)
  const [gridModeEnabled, setGridModeEnabled] =
    useState(true)
  const [showCoords, setShowCoords] = useState(true)

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
            {isSignedIn && <CanvasModal />}
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
        <MainMenu>
          <MainMenu.Item
            onSelect={async () => {
              const nextTheme = cycleTheme()
              await saveTheme(nextTheme)
            }}
            icon={
              theme === Theme.light ? (
                <Sun style={{ height: 14, width: 14 }} />
              ) : (
                <Moon style={{ height: 14, width: 14 }} />
              )
            }
          >
            Toggle Theme
          </MainMenu.Item>
          <MainMenu.Item
            onSelect={() => setShowMeta(!showMeta)}
            icon={
              showMeta ? (
                <Braces style={{ height: 14, width: 14 }} />
              ) : (
                <X style={{ height: 14, width: 14 }} />
              )
            }
          >
            Show Metadata
          </MainMenu.Item>
          <MainMenu.Item
            onSelect={() =>
              setGridModeEnabled(!gridModeEnabled)
            }
            icon={
              gridModeEnabled ? (
                <Grid3X3
                  style={{ height: 14, width: 14 }}
                />
              ) : (
                <X style={{ height: 14, width: 14 }} />
              )
            }
          >
            Show Grid
          </MainMenu.Item>
          <MainMenu.Item
            onSelect={() => setShowCoords(!showCoords)}
            icon={
              showCoords ? (
                <Move3D style={{ height: 14, width: 14 }} />
              ) : (
                <X style={{ height: 14, width: 14 }} />
              )
            }
          >
            Show Coordinates
          </MainMenu.Item>
          <MainMenu.DefaultItems.Export />
          <MainMenu.DefaultItems.SaveAsImage />
          <MainMenu.DefaultItems.Help />
        </MainMenu>
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

  return (
    <div className="absolute w-screen h-screen">
      {Excal}
      <section>
        {loading === LoadingState.Loaded &&
          showMeta &&
          excalElements.map((excalEl, i) => (
            <ShapeInfoButtons key={i} excalEl={excalEl} />
          ))}
      </section>
      {showCoords && PointerCoords}
    </div>
  )
}
