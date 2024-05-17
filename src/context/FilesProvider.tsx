"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"

import {
  type BinaryFileData,
  type BinaryFiles,
} from "@excalidraw/excalidraw/types/types"
import { type ExcalidrawImageElement } from "@excalidraw/excalidraw/types/element/types"

import { toDate } from "@utils"
import { useUploadThing } from "@utils/uploadthing"

import { type WithReactChildren } from "@types"

import { useCanvas2 } from "./CanvasProvider"
import { useShapes } from "./ShapeProvider"

type FilesContext = {
  setFiles: React.Dispatch<
    React.SetStateAction<BinaryFiles>
  >
}

const FilesContext = createContext<FilesContext | null>(
  null,
)

type FilesProviderProps = WithReactChildren

export function FilesProvider({
  children,
}: FilesProviderProps) {
  const { excalidrawAPI, excalElements } = useCanvas2()
  const { uploadShape } = useShapes()

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
        duration: 10_000,
      })

      const res = await startUpload(notUpdatedYetFiles)
      console.log("res", res)
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

  const [isUploadingFiles, setIsUploadingFiles] =
    useState(false)

  useEffect(() => {
    async function upload() {
      if (isUploadingFiles) return

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
    const imageElsIds = excalElements
      .filter((el) => el.type === "image")
      .map((el) => el.id)
    const imageIdsSet = new Set(imageElsIds)
    const totalFiles = Object.values(files).filter(
      (f) => !f.dataURL.startsWith("https://"),
    ).length

    if (imageIdsSet.size === totalFiles) return

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    getImages()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [excalElements])

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
    const currentFileIds = new Set(Object.keys(files))

    for await (const fileId of imgsUrls) {
      if (currentFileIds.has(fileId)) continue

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

        excalidrawAPI.addFiles([imgFile])
      }

      reader.readAsDataURL(imgData)
    }
  }

  return (
    <FilesContext.Provider value={{ setFiles }}>
      {children}
    </FilesContext.Provider>
  )
}

export function useFiles() {
  const context = useContext(FilesContext)

  if (!context) {
    throw new Error(
      "`useFiles` must be used within a `FilesProvider`.",
    )
  }

  return context
}
