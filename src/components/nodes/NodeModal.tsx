"use client"

import { Share2, Star } from "lucide-react"

import { type ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types"

import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Separator,
} from "@shad"

import { LoadingState } from "@types"

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
  excalEl: ExcalidrawElement
}

export function NodeModal({
  excalEl,
}: NodeEdgeCardDialogProps) {
  const { nodes } = useCanvas()
  const node = nodes[excalEl.id]
  const voteTotal = node?.stats?.voteTotal ?? 0

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="link"
          className={cn(
            "p-0 px-[2px] font-bold text-base",
            pointsColor(voteTotal),
          )}
        >
          {voteTotal}
        </Button>
      </DialogTrigger>
      <DialogContent className="border-2 border-gray-700 overflow-y-scroll h-[90vh] rounded-md">
        <NodeProvider excalEl={excalEl}>
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
          <p className="text-gray-400">{node?.nanoId}</p>
        </DialogTitle>
      </DialogHeader>
      <div className="flex flex-col gap-3 mt-2">
        <NodeTitle />
        <NodeDescription />
        <div className="flex justify-between mt-3">
          <div className="flex flex-col gap-1 mt-[6px]">
            <NodeVotePointsSection
              excalId={node.excalId}
              creatorClerkId={node.creator!.clerkId}
              initialUserVotedPoints={
                node.stats?.votedPoints
              }
              initialVoteTotal={node.stats?.voteTotal}
            />
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
