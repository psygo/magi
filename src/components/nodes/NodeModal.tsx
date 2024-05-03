"use client"

import { useParams } from "next/navigation"

import { Share2, Star } from "lucide-react"

import { type ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types"

import "@utils/array"

import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Separator,
} from "@shad"

import { type ExcalId, LoadingState } from "@types"

import {
  CommentsProvider,
  NodeProvider,
  useCanvas,
  useNodeData,
} from "@context"

import { cn, pointsColor } from "@styles"

import { Progress } from "../common/exports"

import { CommentSection } from "../comments/exports"

import {
  NodeTitle,
  NodeDescription,
} from "./NodeTitleAndDescription"
import { NodeAuthor } from "./NodeAuthor"
import { NodeVotePointsSection } from "./NodeVotePointsSection"

type NodeEdgeCardDialogProps = {
  excalId: ExcalId
}

export function NodeModal({
  excalId,
}: NodeEdgeCardDialogProps) {
  const {
    nodes,
    excalAppState,
    getCurrentCanvasSearchParams,
  } = useCanvas()

  const node = nodes[excalId]
  const voteTotal = node?.stats?.voteTotal ?? 0
  const zoom = excalAppState.zoom.value as number

  const params = useParams()
  const defaultOpen = params.node_id
    ?.toString()
    .includes(excalId)

  return (
    <Dialog
      defaultOpen={defaultOpen}
      onOpenChange={(open) => {
        const searchParams = getCurrentCanvasSearchParams()
        const searchParamsString = `?${searchParams.toString()}`
        const nodePath = open ? `/nodes/${excalId}` : ""
        const route = `/canvases/open-public${nodePath}${searchParamsString}`
        window.history.pushState(null, "", route)
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="link"
          className={cn(
            "p-0 px-[2px] font-bold text-base",
            pointsColor(voteTotal),
          )}
          style={{ fontSize: 20 * zoom }}
        >
          {voteTotal}
        </Button>
      </DialogTrigger>
      <DialogContent className="border-2 border-gray-700 overflow-y-scroll h-[90vh] rounded-md">
        <NodeProvider excalId={excalId}>
          <NodeModalContent />
        </NodeProvider>
      </DialogContent>
    </Dialog>
  )
}

function NodeModalContent() {
  const { node, loading } = useNodeData()

  if (!node || loading !== LoadingState.Loaded)
    return <Progress />

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex gap-2 mt-[-10px] mr-5 justify-end">
          <p className="text-gray-400">Element Data</p>
          <p className="text-gray-400">{node?.excalId}</p>
        </DialogTitle>
      </DialogHeader>
      <div className="flex flex-col gap-3 mt-2">
        <NodeTitle />
        <NodeDescription />
        <NodeLink />
        <div className="flex justify-between mt-3">
          <div className="flex flex-col gap-1 mt-[6px]">
            <NodeVotePointsSection />
            <div className="flex gap-1 mt-2 ml-[2px]">
              <Button variant="ghost">
                <Share2 className="h-5 w-5" />
              </Button>
              <Button variant="ghost">
                <Star className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <NodeAuthor
            author={node.creator!}
            updatedAt={node.updatedAt}
          />
        </div>
        <Separator className="my-2" />
        <CommentsProvider>
          <CommentSection />
        </CommentsProvider>
      </div>
    </>
  )
}

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
      <CardContent className="py-2 flex flex-col gap-2">
        <a className="text-blue-500" href={link}>
          {link}
        </a>
        {isYouTube && (
          <iframe
            width="100%"
            height="200"
            src={getYouTubeEmbeddedLink()}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        )}
      </CardContent>
    </Card>
  )
}
