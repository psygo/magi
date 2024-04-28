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

import { NodeProvider, useNodeData } from "@context"

import { cn, pointsColor } from "@styles"

import { Progress } from "../common/exports"

import { CommentSection } from "../comments/exports"

import { NodeTitle, NodeDescription } from "./NodeTitleAndDescription"
import { NodeAuthor } from "./NodeAuthor"
import { NodeVotePointsSection } from "./NodeVotePointsSection"

type NodeEdgeCardDialogProps = {
  excalEl: ExcalidrawElement
  voteTotal: number
}

export function NodeModal({
  excalEl,
  voteTotal,
}: NodeEdgeCardDialogProps) {
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
      <DialogContent className="overflow-y-scroll max-h-[90vh] rounded-md">
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
        <DialogTitle className="flex gap-2 mt-[-8px]">
          <p className="text-gray-500">Element Data</p>
          <p className="text-gray-400">{node?.nanoId}</p>
        </DialogTitle>
      </DialogHeader>
      <div className="flex flex-col gap-4 mt-4">
        <NodeTitle />
        <NodeDescription />
        <NodeAuthor author={node.creator!} />
        <NodeVotePointsSection
          excalId={node.excalId}
          creatorClerkId={node.creator!.clerkId}
          initialUserVotedPoints={node.stats?.votedPoints}
          initialVoteTotal={node.stats?.voteTotal}
        />
        <Separator className="my-2" />
        <CommentSection excalId={node.excalId} />
      </div>
    </>
  )
}
