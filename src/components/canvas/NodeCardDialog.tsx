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
  Separator,
  Textarea,
} from "@shad"

import { stringIsEmpty } from "@utils"

import { LoadingState } from "@types"

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
      <div className="flex flex-col">
        <Title />
        <Description />
        <Separator className="mt-4" />
      </div>
    </>
  )
}

function Title() {
  const { nodeOrEdge, updateNodeOrEdge } =
    useNodeOrEdgeData()

  const [isEditing, setIsEditing] = useState(
    stringIsEmpty(nodeOrEdge?.title),
  )

  const [title, setTitle] = useState(nodeOrEdge?.title)

  if (!nodeOrEdge) return

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          defaultValue={title}
          placeholder="A Great Title"
          onChange={(e) => setTitle(e.target.value)}
        />
        <Button
          variant="outline"
          className="btn border-red-500 text-red-500"
          onClick={() => setIsEditing(false)}
        >
          Cancel
        </Button>
        <Button
          onClick={async () => {
            await updateNodeOrEdge(
              title,
              nodeOrEdge.description ?? "",
            )
            setIsEditing(false)
          }}
        >
          Save
        </Button>
      </div>
    )
  } else {
    return (
      <div className="flex gap-2 items-center">
        <h2 className="text-3xl font-bold">
          {nodeOrEdge.title !== "" ? nodeOrEdge.title : "—"}
        </h2>
        <Button
          variant="ghost"
          className="p-0 px-2 mt-[6px]"
          onClick={() => setIsEditing(true)}
        >
          <Pencil className="h-[15px] w-[15px] text-gray-500" />
        </Button>
      </div>
    )
  }
}

function Description() {
  const { nodeOrEdge, updateNodeOrEdge } =
    useNodeOrEdgeData()

  const [isEditing, setIsEditing] = useState(
    stringIsEmpty(nodeOrEdge?.description),
  )

  const [description, setDescription] = useState(
    nodeOrEdge?.description,
  )

  if (!nodeOrEdge) return

  if (isEditing) {
    return (
      <div className="flex flex-col gap-2 justify-start">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          defaultValue={description}
          placeholder="A great description"
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="flex gap-2 justify-end">
          <Button
            variant="outline"
            className="btn border-red-500 text-red-500"
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={async () => {
              await updateNodeOrEdge(
                nodeOrEdge.title ?? "",
                description,
              )
              setIsEditing(false)
            }}
          >
            Save
          </Button>
        </div>
      </div>
    )
  } else {
    return (
      <div className="flex gap-2 items-center">
        <p className="">
          {nodeOrEdge.description !== ""
            ? nodeOrEdge.description
            : "—"}
        </p>
        <Button
          variant="ghost"
          className="p-0 px-2 mt-[1px]"
          onClick={() => setIsEditing(true)}
        >
          <Pencil className="h-[11px] w-[11px] text-gray-500" />
        </Button>
      </div>
    )
  }
}
