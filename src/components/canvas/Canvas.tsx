"use client"

import { nanoid } from "nanoid"

import { useEffect, useMemo, useState } from "react"

import {
  Braces,
  Grid3X3,
  Moon,
  Move3D,
  Sun,
  X,
} from "lucide-react"

import dynamic from "next/dynamic"
import { useSearchParams } from "next/navigation"

import { useCookies } from "next-client-cookies"

import { useUser } from "@clerk/nextjs"

import {
  type BinaryFileData,
  type BinaryFiles,
} from "@excalidraw/excalidraw/types/types"
import { MainMenu } from "@excalidraw/excalidraw"
import {
  type ExcalidrawElement,
  type ExcalidrawImageElement,
} from "@excalidraw/excalidraw/types/element/types"

import { toDate, toNumber, toPrecision } from "@utils"
import { useUploadThing } from "@utils/uploadthing"

import {
  type FieldOfView,
  LoadingState,
  Theme,
} from "@types"

import { postNodes, saveTheme } from "@actions"

import { useLocalStorage } from "@hooks"

import {
  nodesArrayToRecords,
  useCanvas,
  useTheme,
} from "@context"

import { Progress } from "../common/exports"

import { AccountButton } from "../users/exports"

import { Coordinates } from "./Coordinates"
import { ShapeInfoButtons } from "./ShapeInfoButton"

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
  const { theme, cycleTheme } = useTheme()

  const { isSignedIn } = useUser()

  const [loading, setLoading] = useState(
    LoadingState.NotYet,
  )

  const {
    excalidrawAPI,
    setExcalidrawAPI,
    nodes,
    setNodes,
    excalElements,
    setExcalElements,
    excalAppState,
    setExcalAppState,
    updateSearchParams,
    getMoreNodes,
  } = useCanvas()
  const [lastUpdatedShapes, setLastUpdatedShapes] =
    useState<Date>(new Date())

  const [files, setFiles] = useState<BinaryFiles>({})
  const [lastUpdatedFiles, setLastUpdatedFiles] =
    useState<Date>(new Date())

  const { startUpload } = useUploadThing("imageUploader", {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onClientUploadComplete: () => {},
  })

  const [showMeta, setShowMeta] = useState(true)
  const [gridModeEnabled, setGridModeEnabled] =
    useState(true)
  const [showCoords, setShowCoords] = useState(true)

  const { get: getIsDragging, set: setIsDragging } =
    useLocalStorage("isDragging", false)

  /*------------------------------------------------------*/
  /* 2D Pagination */

  const cookies = useCookies()
  const searchParams = useSearchParams()
  const [initialScrollX, initialScrollY] = [
    toNumber(searchParams.get("scrollX") ?? 0),
    toNumber(searchParams.get("scrollY") ?? 0),
  ]

  const initialFieldOfView: FieldOfView = {
    xLeft: -initialScrollX - window.innerWidth,
    xRight: -initialScrollX + 2 * window.innerWidth,
    yTop: -initialScrollY - window.innerHeight,
    yBottom: -initialScrollY + 2 * window.innerHeight,
  }

  useEffect(() => {
    if (!excalidrawAPI) return

    cookies.set(
      "fieldOfView",
      JSON.stringify(initialFieldOfView),
    )

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    getMoreNodes().then(async () => {
      await getImages()
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [excalidrawAPI])

  async function pagination() {
    const appState = excalidrawAPI!.getAppState()

    const scrollX = Math.round(appState.scrollX)
    const scrollY = Math.round(appState.scrollY)
    const zoom = toPrecision(appState.zoom.value)
    const height = Math.round(appState.height / zoom)
    const width = Math.round(appState.width / zoom)

    const currentScreen = {
      xLeft: -scrollX,
      xRight: -scrollX + width,
      yTop: -scrollY,
      yBottom: -scrollY + height,
    }

    const currentFieldOfView: FieldOfView = JSON.parse(
      cookies.get("fieldOfView")!,
    ) as FieldOfView

    if (
      currentScreen.xLeft < currentFieldOfView.xLeft ||
      currentScreen.xRight > currentFieldOfView.xRight ||
      currentScreen.yTop < currentFieldOfView.yTop ||
      currentScreen.yBottom > currentFieldOfView.yBottom
    ) {
      const newFieldOfView: FieldOfView = {
        xLeft: Math.min(
          currentFieldOfView.xLeft,
          currentScreen.xLeft,
        ),
        xRight: Math.max(
          currentFieldOfView.xRight,
          currentScreen.xRight,
        ),
        yTop: Math.min(
          currentFieldOfView.yTop,
          currentScreen.yTop,
        ),
        yBottom: Math.max(
          currentFieldOfView.yBottom,
          currentScreen.yBottom,
        ),
      }

      cookies.set(
        "fieldOfView",
        JSON.stringify(newFieldOfView),
      )

      await getMoreNodes()
    }
  }

  /*------------------------------------------------------*/

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
        initialData={{
          elements: excalElements,
          appState: excalAppState,
        }}
        theme={theme}
        gridModeEnabled={gridModeEnabled}
        renderTopRightUI={() => <AccountButton />}
        excalidrawAPI={(api) => setExcalidrawAPI(api)}
        generateIdForFile={(f) => {
          const ext = f.type.split("/").second()
          return `${nanoid()}.${ext}`
        }}
        onScrollChange={async () => {
          updateSearchParams()
          await pagination()
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
    isSignedIn,
    theme,
    showMeta,
    gridModeEnabled,
    showCoords,
  ])

  /*------------------------------------------------------*/
  /* Upload Shape */

  const {
    get: getIsUploadingShape,
    set: setIsUploadingShape,
  } = useLocalStorage("isUploadingShape", false)

  async function uploadShape(els: ExcalidrawElement[]) {
    const isUploadingShape = getIsUploadingShape()
    const isDragging = getIsDragging()

    if (isUploadingShape || isDragging) return

    setIsUploadingShape(true)
    const newNodes = await postNodes(els)
    setIsUploadingShape(false)

    if (!newNodes) return

    const newNodesRecords = nodesArrayToRecords(newNodes)

    setNodes({
      ...nodes,
      ...newNodesRecords,
    })

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

  /*------------------------------------------------------*/
  /* Upload Files */

  async function uploadFiles() {
    const allFiles = excalidrawAPI!.getFiles()
    const notUpdatedYetFiles = Object.values(allFiles)
      .filter((f) => toDate(f.created) > lastUpdatedFiles)
      .map((f) => {
        return new File(
          [
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            Uint8Array.from(
              atob(f.dataURL.split(",")[1]!),
              (m) => m.codePointAt(0),
            ),
          ],
          f.id,
          { type: f.mimeType },
        )
      })

    if (notUpdatedYetFiles.length > 0) {
      excalidrawAPI!.setToast({
        message: "Uploading File(s)",
      })

      const res = await startUpload(notUpdatedYetFiles)
      if (!res) return

      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      notUpdatedYetFiles.forEach(async (f) => {
        const newFileId = res.find(
          (r) => r.name === f.name,
        )!.url

        const toBeUpdatedShapes = excalElements
          .filter(
            (el) =>
              el.type === "image" && el.fileId === f.name,
          )
          .map((el) => {
            const e = el as ExcalidrawImageElement
            return {
              ...e,
              fileId: newFileId,
            } as ExcalidrawImageElement
          })

        await uploadShape(toBeUpdatedShapes)
      })

      setLastUpdatedFiles(new Date())

      excalidrawAPI!.setToast({
        message: "Upload Complete",
        duration: 2_000,
      })
    }
  }

  const {
    get: getIsUploadingFiles,
    set: setIsUploadingFiles,
  } = useLocalStorage("isUploadingFiles", false)

  useEffect(() => {
    async function upload() {
      const isSaving = getIsUploadingFiles()

      if (isSaving) return

      setIsUploadingFiles(true)
      await uploadFiles()
      setIsUploadingFiles(false)
    }

    if (!excalidrawAPI) return
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    upload()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files])

  async function getImages() {
    if (!excalidrawAPI) return

    const els = excalidrawAPI.getSceneElements()

    const imgsUrls = els
      .filter(
        (excalEl) =>
          excalEl.type === "image" && !excalEl.isDeleted,
      )
      .map((excalImg) => {
        const fileId = (excalImg as ExcalidrawImageElement)
          .fileId
        return fileId!
      })

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    imgsUrls.forEach(async (fileId) => {
      const res = await fetch(fileId)
      const imgData = await res.blob()
      const reader = new FileReader()

      reader.onload = () => {
        const imgFile: BinaryFileData = {
          id: fileId,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          dataURL: reader.result!,
        }

        if (excalidrawAPI) {
          excalidrawAPI?.addFiles([imgFile])
          excalidrawAPI?.updateScene({
            elements: [
              ...excalidrawAPI.getSceneElementsIncludingDeleted(),
            ],
            appState: excalidrawAPI.getAppState(),
          })
        }
      }

      reader.readAsDataURL(imgData)
    })
  }

  /*------------------------------------------------------*/

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
      {showCoords && (
        <Coordinates
          x={excalAppState.scrollX}
          y={excalAppState.scrollY}
        />
      )}
    </div>
  )
}
