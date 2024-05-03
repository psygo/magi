"use client"

import { nanoid } from "nanoid"

import { useUploadThing } from "@utils/uploadthing"

import { useEffect, useMemo, useState } from "react"

import { Check, Moon, Sun, X } from "lucide-react"

import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"

import { useUser } from "@clerk/nextjs"

import {
  type BinaryFileData,
  type BinaryFiles,
  type ExcalidrawImperativeAPI,
} from "@excalidraw/excalidraw/types/types"
import { MainMenu } from "@excalidraw/excalidraw"
import {
  type ExcalidrawElement,
  type ExcalidrawImageElement,
} from "@excalidraw/excalidraw/types/element/types"

import { toDate } from "@utils"

import { LoadingState, Theme } from "@types"

import { postNodes, saveTheme } from "@actions"

import { useLocalStorage } from "@hooks"

import {
  nodesArrayToRecords,
  useCanvas,
  useTheme,
} from "@context"

import { Progress } from "@components"

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

  const [excalidrawAPI, setExcalidrawAPI] =
    useState<ExcalidrawImperativeAPI>()
  const [loading, setLoading] = useState(
    LoadingState.NotYet,
  )

  const {
    nodes,
    setNodes,
    excalElements,
    setExcalElements,
    excalAppState,
    setExcalAppState,
    getCurrentCanvasSearchParams: getCurrentSearchParams,
  } = useCanvas()
  const [lastUpdatedShapes, setLastUpdatedShapes] =
    useState<Date>(new Date())

  const [files, setFiles] = useState<BinaryFiles>({})
  const [lastUpdatedFiles, setLastUpdatedFiles] =
    useState<Date>(new Date())

  const { startUpload } = useUploadThing("imageUploader", {
    onClientUploadComplete: () => {
      console.log("upload complete")
    },
  })

  const [showMeta, setShowMeta] = useState(true)

  const router = useRouter()

  const { get: getIsDragging, set: setIsDragging } =
    useLocalStorage("isDragging")

  const Excal = useMemo(() => {
    return (
      <Excalidraw
        name=""
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
        excalidrawAPI={(api) => setExcalidrawAPI(api)}
        generateIdForFile={(f) => {
          const ext = f.type.split("/").second()
          return `${nanoid()}.${ext}`
        }}
        onScrollChange={() => {
          const searchParams = getCurrentSearchParams(
            excalidrawAPI!.getAppState(),
          )
          const searchParamsString = `?${searchParams.toString()}`
          router.replace(
            `/canvases/open-public${searchParamsString}`,
          )
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
                <Check style={{ height: 14, width: 14 }} />
              ) : (
                <X style={{ height: 14, width: 14 }} />
              )
            }
          >
            Show Metadata
          </MainMenu.Item>
          <MainMenu.DefaultItems.Export />
          <MainMenu.DefaultItems.SaveAsImage />
          <MainMenu.DefaultItems.Help />
        </MainMenu>
      </Excalidraw>
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [excalidrawAPI, theme, showMeta])

  /*------------------------------------------------------*/
  /* Upload Shape */

  const {
    get: getIsUploadingShape,
    set: setIsUploadingShape,
  } = useLocalStorage("isUploadingShape")

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setIsUploadingShape(false), [])

  async function uploadShape(els: ExcalidrawElement[]) {
    const isUploadingShape = getIsUploadingShape()

    if (isUploadingShape || getIsDragging()) return

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
  } = useLocalStorage("isUploadingFiles")

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setIsUploadingFiles(false), [])

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

  useEffect(() => {
    async function getImages() {
      const imgsUrls = excalElements
        .filter(
          (excalEl) =>
            excalEl.type === "image" && !excalEl.isDeleted,
        )
        .map((excalImg) => {
          const fileId = (
            excalImg as ExcalidrawImageElement
          ).fileId
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

    if (!excalidrawAPI) return
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    getImages()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [excalidrawAPI])

  /*------------------------------------------------------*/

  return (
    <div>
      <section
        onDragStart={() => {
          console.log("dragstart")
        }}
        onDragEnd={() => {
          console.log("dragend")
        }}
        className="absolute w-screen h-screen"
      >
        {Excal}
      </section>
      <section>
        {loading === LoadingState.Loaded &&
          showMeta &&
          excalElements.map((excalEl, i) => (
            <ShapeInfoButtons key={i} excalEl={excalEl} />
          ))}
      </section>
    </div>
  )
}
