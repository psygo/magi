"use client"

import {
  useUploadThing,
  uploadFiles,
} from "@utils/uploadthing"

import { useEffect, useMemo, useState } from "react"

import { Check, Moon, Sun, X } from "lucide-react"

import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"

import { useUser } from "@clerk/nextjs"

import {
  type BinaryFiles,
  type BinaryFileData,
  type ExcalidrawImperativeAPI,
} from "@excalidraw/excalidraw/types/types"
import { MainMenu } from "@excalidraw/excalidraw"

import { toDate } from "@utils"

import { LoadingState, Theme } from "@types"

import { postNodes, saveTheme } from "@actions"

import {
  nodesArrayToRecords,
  useCanvas,
  useTheme,
} from "@context"

import { Progress } from "@components"

import { ShapeInfoButtons } from "./ShapeInfoButton"
import { type ExcalidrawImageElement } from "@excalidraw/excalidraw/types/element/types"

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
    getCurrentSearchParams,
  } = useCanvas()

  const [lastUpdated, setLastUpdated] = useState<Date>(
    new Date(),
  )

  const [files, setFiles] = useState<BinaryFiles>({})

  const [showMeta, setShowMeta] = useState(true)

  const router = useRouter()

  const { startUpload } = useUploadThing("imageUploader", {
    onClientUploadComplete: () => {
      console.log("upload complete")
    },
  })

  useEffect(() => {
    async function getImages() {
      const imgsUrls: string[] = [
        // "https://upload.wikimedia.org/wikipedia/commons/f/f6/Sinner_MCM23_%288%29_%2852883593853%29.jpg",
        // "https://upload.wikimedia.org/wikipedia/commons/b/b7/Alcaraz_MCM22_%2827%29_%2852036462443%29_%28edited%29.jpg",
      ]
      const imgUrls = excalElements
        .filter((excalEl) => excalEl.type === "image")
        .map((excalImg) => {
          const fileId = (
            excalImg as ExcalidrawImageElement
          ).fileId
        })

      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      imgsUrls.forEach(async (imgUrl) => {
        // const imgUrl =
        //   "https://upload.wikimedia.org/wikipedia/commons/f/f6/Sinner_MCM23_%288%29_%2852883593853%29.jpg"

        const res = await fetch(imgUrl)
        const imgData = await res.blob()
        const reader = new FileReader()

        reader.onload = () => {
          const imgFile: BinaryFileData = {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            id: imgUrl,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            dataURL: reader.result!,
            mimeType: "image/jpeg",
            created: 1714504957800,
          }

          if (excalidrawAPI) {
            excalidrawAPI?.addFiles([imgFile])
            excalidrawAPI?.updateScene({
              elements: [
                ...excalidrawAPI?.getSceneElementsIncludingDeleted(),
              ],
              appState: excalidrawAPI.getAppState(),
            })
          }
        }

        reader.readAsDataURL(imgData)
      })
    }

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    getImages()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [excalidrawAPI])

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
        onScrollChange={() => {
          const searchParams = getCurrentSearchParams(
            excalidrawAPI!.getAppState(),
          )
          router.replace(
            `/canvases/open-public?${searchParams.toString()}`,
          )
        }}
        onChange={() => {
          const els =
            excalidrawAPI?.getSceneElementsIncludingDeleted()

          const appState = excalidrawAPI!.getAppState()
          setExcalAppState(appState)

          const newAllFiles = excalidrawAPI!.getFiles()
          setFiles({ ...newAllFiles })

          setLoading(
            appState.isLoading
              ? LoadingState.Loading
              : LoadingState.Loaded,
          )

          if (els) setExcalElements([...els])
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

  useEffect(() => {
    // TODO: This will upload like crazy when not
    //       copy-pasting!!!
    async function uploadFiles() {
      const notUpdatedYetFiles = Object.values(files)
        .filter((f) => toDate(f.created) > lastUpdated)
        .map((f) => {
          const ext = f.mimeType.split("/").second()
          return new File(
            [
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              Uint8Array.from(
                atob(f.dataURL.split(",")[1]!),
                (m) => m.codePointAt(0),
              ),
            ],
            `${f.id}.${ext}`,
            { type: f.mimeType },
          )
        })

      if (notUpdatedYetFiles.length > 0)
        await startUpload(notUpdatedYetFiles)
    }

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    uploadFiles()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files])

  async function onExcalUpdate() {
    const notUpdatedYet = excalElements.filter(
      (el) => toDate(el.updated) > lastUpdated,
    )

    // console.log("app state", excalAppState)
    // console.log(
    //   "all elements",
    //   excalidrawAPI?.getSceneElementsIncludingDeleted(),
    // )
    // console.log("not updated", notUpdatedYet)
    // // console.log("files", excalidrawAPI?.getFiles())
    // console.log("files", files)

    if (notUpdatedYet.length > 0) {
      const newNodes = await postNodes(notUpdatedYet)

      if (newNodes) {
        const newNodesRecords =
          nodesArrayToRecords(newNodes)

        setNodes({
          ...nodes,
          ...newNodesRecords,
        })

        setLastUpdated(new Date())
      }
    }
  }

  function delayedExcalUpdate() {
    if (!isSignedIn) return

    // The delay here is used because apparently the
    // snapping of the arrow is not done immediately.
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    setTimeout(async () => await onExcalUpdate(), 100)
  }

  return (
    <div>
      <section
        className="absolute w-screen h-screen"
        onPointerUp={delayedExcalUpdate}
        onKeyUp={delayedExcalUpdate}
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
