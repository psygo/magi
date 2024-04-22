"use client"

import { useState } from "react"

import { Info, Pencil } from "lucide-react"

import { type ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types"

import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
} from "@shad"

import { stringIsEmpty } from "@utils"

import { LoadingState } from "@types"

import { putEdge, putNode } from "@actions"

import {
  NodeOrEdgeProvider,
  useNodeOrEdgeData,
} from "@context"

import { Progress } from "../common/exports"

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
      <DialogContent className="sm:max-w-[425px]">
        <NodeOrEdgeProvider excalEl={excalEl}>
          <NodeCardDialogContent />
        </NodeOrEdgeProvider>
      </DialogContent>
    </Dialog>
  )
}

function NodeCardDialogContent() {
  const { nodeOrEdge, loading } = useNodeOrEdgeData()

  if (!nodeOrEdge || loading !== LoadingState.Loaded)
    return <Progress />

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex gap-2">
          <p className="text-gray-500">Node Data</p>
          <p className="text-gray-400">
            {nodeOrEdge?.excalId}
          </p>
        </DialogTitle>
      </DialogHeader>
      <div className="flex flex-col ">
        <Title />
      </div>
    </>
  )
}

function Title() {
  const { nodeOrEdge, isNode } = useNodeOrEdgeData()

  const [isEditing, setIsEditing] = useState(
    stringIsEmpty(nodeOrEdge?.title),
  )

  const [title, setTitle] = useState(nodeOrEdge?.title)

  if (!nodeOrEdge) return

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <Label htmlFor="name">Title</Label>
        <Input
          id="name"
          defaultValue={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Button onClick={() => setIsEditing(false)}>
          Cancel
        </Button>
        <Button
          onClick={async () => {
            isNode
              ? await putNode(
                  nodeOrEdge.excalId,
                  title,
                  nodeOrEdge.description ?? "",
                )
              : await putEdge(
                  nodeOrEdge.excalId,
                  title,
                  nodeOrEdge.description ?? "",
                )
          }}
        >
          Save
        </Button>
      </div>
    )
  } else {
    return (
      <div className="flex gap-4 items-center">
        <h2 className="text-3xl font-bold">
          {nodeOrEdge.title !== "" ? nodeOrEdge.title : "—"}
        </h2>
        <Button
          variant="ghost"
          className="p-0 pt-[6px]"
          onClick={() => setIsEditing(true)}
        >
          <Pencil className="h-[15px] w-[15px] text-gray-500" />
        </Button>
      </div>
    )
  }
}
