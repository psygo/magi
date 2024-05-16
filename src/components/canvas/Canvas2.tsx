"use client"

import { useEffect, useMemo, useState } from "react"

import dynamic from "next/dynamic"

import {
  type BinaryFileData,
  type BinaryFiles,
} from "@excalidraw/excalidraw/types/types"
import { type ExcalidrawImageElement } from "@excalidraw/excalidraw/types/element/types"

import { useUploadThing } from "@utils/uploadthing"

import { toDate } from "@utils"

import { type Pointer } from "@types"

import { useLocalStorage } from "@hooks"

import {
  useCanvas2,
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

  const { setIsDragging, uploadShape } = useShapes()

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
        onPointerUpdate={({ pointer }) => {
          setPointer(pointer)
        }}
        onScrollChange={async () => {
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
          setExcalAppState({ ...appState })
          setFiles({ ...files })
        }}
      />
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [excalidrawAPI])

  /*------------------------------------------------------*/
  /* Upload Files */

  const [files, setFiles] = useState<BinaryFiles>({})
  const [lastUpdatedFiles, setLastUpdatedFiles] =
    useState<Date>(new Date())

  const { startUpload } = useUploadThing("imageUploader", {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onClientUploadComplete: () => {},
  })

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

      console.log("not updaed files", notUpdatedYetFiles)

      const res = await startUpload(notUpdatedYetFiles)
      console.log("res", res)
      if (!res) return

      // // eslint-disable-next-line @typescript-eslint/no-misused-promises
      // notUpdatedYetFiles.forEach(async (f) => {
      //   const newFileId = res.find(
      //     (r) => r.name === f.name,
      //   )!.url

      //   const toBeUpdatedShapes = excalElements
      //     .filter(
      //       (el) =>
      //         el.type === "image" && el.fileId === f.name,
      //     )
      //     .map((el) => {
      //       const e = el as ExcalidrawImageElement
      //       return {
      //         ...e,
      //         fileId: newFileId,
      //       } as ExcalidrawImageElement
      //     })

      //   await uploadShape(toBeUpdatedShapes)
      // })

      // setLastUpdatedFiles(new Date())

      // excalidrawAPI!.setToast({
      //   message: "Upload Complete",
      //   duration: 2_000,
      // })
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

  // useEffect(() => {
  //   if (!excalidrawAPI) return
  //   // eslint-disable-next-line @typescript-eslint/no-floating-promises
  //   getImages()
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [excalidrawAPI])

  // async function getImages() {
  //   if (!excalidrawAPI) return

  //   const els = excalidrawAPI.getSceneElements()

  //   const imgsUrls = els
  //     .filter(
  //       (excalEl) =>
  //         excalEl.type === "image" && !excalEl.isDeleted,
  //     )
  //     .map((excalImg) => {
  //       const fileId = (excalImg as ExcalidrawImageElement)
  //         .fileId
  //       return fileId!
  //     })

  //   // eslint-disable-next-line @typescript-eslint/no-misused-promises
  //   imgsUrls.forEach(async (fileId) => {
  //     const res = await fetch(fileId)
  //     const imgData = await res.blob()
  //     const reader = new FileReader()

  //     reader.onload = () => {
  //       const imgFile: BinaryFileData = {
  //         id: fileId,
  //         // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //         // @ts-ignore
  //         dataURL: reader.result!,
  //       }

  //       if (excalidrawAPI) {
  //         excalidrawAPI?.addFiles([imgFile])
  //         excalidrawAPI?.updateScene({
  //           elements: [
  //             ...excalidrawAPI.getSceneElementsIncludingDeleted(),
  //           ],
  //           appState: excalidrawAPI.getAppState(),
  //         })
  //       }
  //     }

  //     reader.readAsDataURL(imgData)
  //   })
  // }

  /*------------------------------------------------------*/

  return (
    <div className="absolute w-screen h-screen">
      {Excal}
      {PointerCoords}
      {/* <Coordinates x={pointer.x} y={pointer.y} /> */}
    </div>
  )
}
