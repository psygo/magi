"use client"

import { Info } from "lucide-react"

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
} from "@shad"

import { type ExcalId, LoadingState } from "@types"

import { useNodeOrEdge } from "@hooks"

import { Progress } from "../common/exports"

type NodeEdgeCardDialogProps = {
  excalId: ExcalId
  isNode?: boolean
}

function NodeCardDialogContent({
  excalId,
  isNode = true,
}: NodeEdgeCardDialogProps) {
  const { nodeOrEdge, loading } = useNodeOrEdge(
    excalId,
    isNode,
  )

  if (loading !== LoadingState.Loaded) return <Progress />

  return (
    <>
      <DialogHeader>
        <DialogTitle>{nodeOrEdge?.id}</DialogTitle>
        <DialogDescription>
          Make changes to your profile here. Click save when
          you&apos;re done.
        </DialogDescription>
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
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="username" className="text-right">
            Username
          </Label>
          <Input
            id="username"
            defaultValue="@peduarte"
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

export function NodeCardDialog({
  excalId,
  isNode = true,
}: NodeEdgeCardDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="p-0 m-0">
          <Info className="h-[13px] w-[13px]" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <NodeCardDialogContent
          excalId={excalId}
          isNode={isNode}
        />
      </DialogContent>
    </Dialog>
  )
}
