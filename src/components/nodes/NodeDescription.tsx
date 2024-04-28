"use client"

import React, { useState } from "react"

import { useUser } from "@clerk/nextjs"

import { Label, Textarea } from "@shad"

import { stringIsEmpty } from "@utils"

import { useNodeData } from "@context"

import {
  EditableContentContainerEdit,
  EditableContentContainerView,
  autoFocusDefault,
} from "../common/exports"

import { type TitleProps } from "./NodeTitle"

type DescriptionProps = TitleProps

export function NodeDescription({
  aF = true,
}: DescriptionProps) {
  const { node, updateNode } = useNodeData()

  const { user } = useUser()
  const userIsAuthor = !!(
    user && user.id === node!.creator!.clerkId
  )

  const [isEditing, setIsEditing] = useState(
    stringIsEmpty(node?.description),
  )

  const [description, setDescription] = useState(
    node?.description,
  )

  const aFocus = { ...autoFocusDefault, autoFocus: aF }

  if (!node) return

  if (isEditing && userIsAuthor) {
    return (
      <EditableContentContainerEdit
        onCancel={() => setIsEditing(false)}
        onSave={async () => {
          await updateNode(node.title, description)

          setIsEditing(false)
        }}
      >
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="A great description"
          {...aFocus}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </EditableContentContainerEdit>
    )
  } else {
    return (
      <EditableContentContainerView
        onEdit={() => setIsEditing(true)}
        iconSize={13}
        showEditButton={userIsAuthor}
      >
        <p className="">
          {node.description !== "" ? node.description : "—"}
        </p>
      </EditableContentContainerView>
    )
  }
}
