"use client"

import { useState } from "react"

import { Pencil } from "lucide-react"

import {
  Button,
  Input,
  Label,
} from "~/components/common/shad/exports"

import { stringIsEmpty } from "@utils"

import { useNodeData } from "@context"

export function Title() {
  const { node, updateNode } = useNodeData()

  const [isEditing, setIsEditing] = useState(
    stringIsEmpty(node?.title),
  )

  const [title, setTitle] = useState(node?.title)

  if (!node) return

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
            await updateNode(title, node.description ?? "")

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
          {node.title !== "" ? node.title : "—"}
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
