"use client"

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

  if (loading !== LoadingState.Loaded) return <Progress />

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          Node Data ({nodeOrEdge?.excalId})
        </DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Name
          </Label>
          <Input
            id="name"
            defaultValue="Pedro Duarte"
            className="col-span-3"
          />
        </div>
      </div>
      <DialogFooter>
        <Button type="submit">Save changes</Button>
      </DialogFooter>
    </>
  )
}
