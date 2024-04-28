"use client"

import { useUser } from "@clerk/nextjs"

import { LoadingState } from "@types"

import { useNodeData } from "@context"

import { EditableField, FieldType } from "../common/exports"

export function NodeTitle() {
  const { node, updateNode, loadingUpdate } = useNodeData()

  const { user } = useUser()
  const userIsAuthor = !!(
    user && user.id === node!.creator!.clerkId
  )

  if (!node) return

  return (
    <EditableField
      content={
        node.title === "" ? "No title yet" : node.title
      }
      contentClassName="text-2xl font-bold"
      isEditable={userIsAuthor}
      label="Title"
      placeholder="Your title here"
      initialFieldValue={node.title}
      onSaveHook={async (v) =>
        await updateNode(v, node.description)
      }
      loading={loadingUpdate === LoadingState.Loading}
    />
  )
}

export function NodeDescription() {
  const { node, updateNode, loadingUpdate } = useNodeData()

  const { user } = useUser()
  const userIsAuthor = !!(
    user && user.id === node!.creator!.clerkId
  )

  if (!node) return

  return (
    <EditableField
      type={FieldType.textarea}
      content={
        node.description === ""
          ? "No title yet"
          : node.description
      }
      contentClassName="text-gray-400"
      isEditable={userIsAuthor}
      label="Description"
      placeholder="Your description here"
      initialFieldValue={node.description}
      onSaveHook={async (v) =>
        await updateNode(node.title, v)
      }
      loading={loadingUpdate === LoadingState.Loading}
    />
  )
}
