"use client"

import { useEffect, useMemo, useState } from "react"

import { Check, Moon, Sun, X } from "lucide-react"

import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"

import { useUser } from "@clerk/nextjs"

import {
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
import { ExcalidrawImageElement } from "@excalidraw/excalidraw/types/element/types"

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

  const [showMeta, setShowMeta] = useState(true)

  const router = useRouter()

  useEffect(() => {
    async function getImages() {
      const imgsUrls: string[] = [
        // "https://upload.wikimedia.org/wikipedia/commons/f/f6/Sinner_MCM23_%288%29_%2852883593853%29.jpg",
        // "https://upload.wikimedia.org/wikipedia/commons/b/b7/Alcaraz_MCM22_%2827%29_%2852036462443%29_%28edited%29.jpg",
      ]

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
          const imgEl: ExcalidrawImageElement = {
            id: imgUrl,
            type: "image",
            x: 231,
            y: 277.5,
            width: 190,
            height: 285,
            angle: 0,
            strokeColor: "transparent",
            backgroundColor: "transparent",
            fillStyle: "solid",
            strokeWidth: 2,
            strokeStyle: "solid",
            roughness: 1,
            opacity: 100,
            groupIds: [],
            frameId: null,
            roundness: null,
            seed: 1479136073,
            version: 4,
            versionNonce: 1468320745,
            isDeleted: false,
            boundElements: null,
            updated: 1714504957809,
            link: null,
            locked: false,
            status: "saved",
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            fileId: imgUrl,
            scale: [1, 1],
          }

          if (excalidrawAPI) {
            excalidrawAPI?.addFiles([imgFile])
            excalidrawAPI?.updateScene({
              elements: [
                ...excalidrawAPI?.getSceneElementsIncludingDeleted(),
                imgEl,
              ],
              appState: excalidrawAPI.getAppState(),
              commitToHistory: false,
            })
          }
        }

        reader.readAsDataURL(imgData)
      })
    }

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    getImages()
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
    // console.log("files", excalidrawAPI?.getFiles())

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
