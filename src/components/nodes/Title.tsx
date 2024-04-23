"use client"

import { useState } from "react"

import { Input, Label } from "@shad"

import { stringIsEmpty } from "@utils"

import { useNodeData } from "@context"

import {
  EditableContentContainerEdit,
  EditableContentContainerView,
  autoFocus,
} from "../common/exports"

export function Title() {
  const { node, updateNode } = useNodeData()

  const [isEditing, setIsEditing] = useState(
    stringIsEmpty(node?.title),
  )

  const [title, setTitle] = useState(node?.title)

  if (!node) return

  if (isEditing) {
    return (
      <EditableContentContainerEdit
        onCancel={() => setIsEditing(false)}
        onSave={async () => {
          await updateNode(title, node.description)

          setIsEditing(false)
        }}
      >
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="A Great Title"
          {...autoFocus}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </EditableContentContainerEdit>
    )
  } else {
    return (
      <EditableContentContainerView
        onEdit={() => {
          setIsEditing(true)
        }}
        iconSize={13}
      >
        <h2 className="text-3xl font-bold">
          {node.title !== "" ? node.title : "—"}
        </h2>
      </EditableContentContainerView>
    )
  }
}
