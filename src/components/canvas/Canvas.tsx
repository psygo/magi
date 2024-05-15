"use client"

import { nanoid } from "nanoid"

import { useEffect, useMemo, useState } from "react"

import { useDebouncedCallback } from "use-debounce"

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
import { useRouter } from "next/navigation"

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
  ScrollAndZoom,
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
  const router = useRouter()

  const [scrollAndZoom, setScrollAndZoom] =
    useState<ScrollAndZoom>({
      scrollX: excalAppState.scrollX,
      scrollY: excalAppState.scrollY,
      zoom: excalAppState.zoom.value,
    })

  useEffect(() => {
    if (!excalidrawAPI) return

    cookies.set(
      "fieldOfView",
      JSON.stringify({
        xLeft: -scrollAndZoom.scrollX - window.innerWidth,
        xRight:
          -scrollAndZoom.scrollX + 2 * window.innerWidth,
        yTop: -scrollAndZoom.scrollY - window.innerHeight,
        yBottom:
          -scrollAndZoom.scrollY + 2 * window.innerHeight,
      }),
    )

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [excalidrawAPI])

  function updateSearchParams() {
    const scrollX = Math.round(scrollAndZoom.scrollX)
    const scrollY = Math.round(scrollAndZoom.scrollY)
    const zoom = toPrecision(scrollAndZoom.zoom)

    const searchParams = new URLSearchParams()
    searchParams.set("scrollX", scrollX.toString())
    searchParams.set("scrollY", scrollY.toString())
    searchParams.set("zoom", zoom.toString())

    const searchParamsString = `?${searchParams.toString()}`
    router.replace(
      `/canvases/open-public${searchParamsString}`,
    )
  }

  function pagination() {
    if (!excalidrawAPI) return
    const appState = excalidrawAPI.getAppState()

    const scrollX = scrollAndZoom.scrollX
    const scrollY = scrollAndZoom.scrollY
    const height = appState.height
    const width = appState.width

    const currentScreen = {
      xLeft: -scrollX,
      xRight: -scrollX + width,
      yTop: -scrollY,
      yBottom: -scrollY + height,
    }

    const deltaFieldOfView: FieldOfView = cookies.get(
      "deltaFieldOfView",
    )
      ? (JSON.parse(
          cookies.get("deltaFieldOfView")!,
        ) as FieldOfView)
      : currentScreen

    const newFieldOfView: FieldOfView = {
      xLeft:
        currentScreen.xLeft < deltaFieldOfView.xLeft
          ? currentScreen.xLeft
          : deltaFieldOfView.xRight,
      xRight:
        currentScreen.xRight > deltaFieldOfView.xRight
          ? currentScreen.xRight
          : deltaFieldOfView.xLeft,
      yTop:
        currentScreen.yTop < deltaFieldOfView.yTop
          ? currentScreen.yTop
          : deltaFieldOfView.yBottom,
      yBottom:
        currentScreen.yBottom > deltaFieldOfView.yBottom
          ? currentScreen.yBottom
          : deltaFieldOfView.yTop,
    }

    cookies.set(
      "deltaFieldOfView",
      JSON.stringify(newFieldOfView),
    )
  }

  const debouncedScrollAndZoom = useDebouncedCallback(
    (newScrollAndZoom: ScrollAndZoom) => {
      setScrollAndZoom({ ...newScrollAndZoom })
    },
    1_000,
  )

  useEffect(() => {
    pagination()
    updateSearchParams()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollAndZoom])

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
          // updateSearchParams()
          // await pagination()
          const appState = excalidrawAPI!.getAppState()
          debouncedScrollAndZoom({
            scrollX: appState.scrollX,
            scrollY: appState.scrollY,
            zoom: appState.zoom.value,
          })
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
