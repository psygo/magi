"use client"

import { useState } from "react"

import { Pencil } from "lucide-react"

import {
  Button,
  Label,
  Textarea,
} from "~/components/common/shad/exports"

import { stringIsEmpty } from "@utils"

import { useNodeData } from "@context"

export function Description() {
  const { node, updateNode } = useNodeData()

  const [isEditing, setIsEditing] = useState(
    stringIsEmpty(node?.description),
  )

  const [description, setDescription] = useState(
    node?.description,
  )

  if (!node) return

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
              await updateNode(
                node.title ?? "",
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
          {node.description !== "" ? node.description : "—"}
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
