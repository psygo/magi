"use client"

import { useState } from "react"

import { Info } from "lucide-react"

import { type ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types"

import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
} from "@shad"

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
  const { nodeOrEdge, loading, isNode } =
    useNodeOrEdgeData()

  const [isEditing, setIsEditing] = useState(false)

  const [title, setTitle] = useState(nodeOrEdge?.title)

  if (!nodeOrEdge || loading !== LoadingState.Loaded)
    return <Progress />

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex gap-2">
          Node Data
          <p className="text-gray-500">
            {nodeOrEdge?.excalId}
          </p>
        </DialogTitle>
      </DialogHeader>
      <div className="flex flex-col">
        {!isEditing ? (
          <div className="flex gap-2 items-center">
            <h2>{nodeOrEdge.title}</h2>
            <Button onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2 mt-5">
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
        )}
      </div>
      <DialogFooter>
        <Button type="submit">Save changes</Button>
      </DialogFooter>
    </>
  )
}
