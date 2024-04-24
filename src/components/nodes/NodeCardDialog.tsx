"use client"

import { Info } from "lucide-react"

import { type ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types"

import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Separator,
} from "~/components/common/shad/exports"

import { LoadingState } from "@types"

import { NodeProvider, useNodeData } from "@context"

import { Progress } from "../common/exports"

import { CommentSection } from "../comments/exports"

import { Title } from "./Title"
import { Description } from "./Description"

type NodeEdgeCardDialogProps = {
  excalEl: ExcalidrawElement
}

export function NodeCardDialog({
  excalEl,
}: NodeEdgeCardDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="p-0 m-0">
          <Info className="h-[13px] w-[13px]" />
        </Button>
      </DialogTrigger>
      <DialogContent className="overflow-y-scroll max-h-[90vh]">
        <NodeProvider excalEl={excalEl}>
          <NodeCardDialogContent />
        </NodeProvider>
      </DialogContent>
    </Dialog>
  )
}

function NodeCardDialogContent() {
  const { node, loading } = useNodeData()

  if (!node || loading !== LoadingState.Loaded)
    return <Progress />

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex gap-2">
          <p className="text-gray-500">Node Data</p>
          <p className="text-gray-400">{node?.excalId}</p>
        </DialogTitle>
      </DialogHeader>
      <div className="flex flex-col gap-4 mt-4">
        <Title />
        <Description />
        <Separator className="my-2" />
        <CommentSection excalId={node.excalId} />
      </div>
    </>
  )
}
