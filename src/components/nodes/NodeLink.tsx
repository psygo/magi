"use client"

import { type ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types"

import "@utils/array"

import { Card, CardContent } from "@shad"

import { useNodeData } from "@providers"

export function NodeLink() {
  const { node } = useNodeData()

  const excalData = node?.excalData as ExcalidrawElement
  const link = excalData?.link

  if (!link) return

  const isYouTube =
    link.includes("youtube.com") ||
    link.includes("youtu.be")

  function getYouTubeEmbeddedLink() {
    const youtubeId = link!.split("/").last()
    return `https://www.youtube.com/embed/${youtubeId}`
  }

  return (
    <Card>
      <CardContent className="py-2 px-3 flex flex-col gap-2">
        {!isYouTube && (
          <a className="text-blue-500" href={link}>
            {link.split("//").second()}
          </a>
        )}
        {isYouTube && (
          <iframe
            width="100%"
            height="240"
            src={getYouTubeEmbeddedLink()}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        )}
      </CardContent>
    </Card>
  )
}
