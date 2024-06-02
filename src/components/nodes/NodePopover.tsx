"use client"

import "@utils/array"

import { Loader2 } from "lucide-react"

import { LoadingState } from "@types"

import { CommentsProvider, useNodeData } from "@providers"

import {
  CardContent,
  CardHeader,
  CardTitle,
  Separator,
} from "@shad"

import { CommentSection } from "../comments/Comment"

import { NodeAuthor } from "./NodeAuthor"
import { NodeLink } from "./NodeLink"
import {
  NodeDescription,
  NodeTitle,
} from "./NodeTitleAndDescription"
import { NodeVotePointsSection } from "./NodeVotePointsSection"

export function NodePopoverContent() {
  const { node, loading } = useNodeData()

  if (!node || loading !== LoadingState.Loaded)
    return (
      <Loader2 className="p-4 h-16 w-16 animate-spin" />
    )

  return (
    <>
      <CardHeader className="py-4 px-7">
        <CardTitle className="flex gap-2 text-base justify-end">
          <p className="text-gray-400">Element Data</p>
          <p className="text-gray-400">{node?.excalId}</p>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <NodeTitle />
        <NodeDescription />
        <NodeLink />
        <div className="flex justify-between mt-3">
          <div className="flex flex-col gap-1 mt-[6px]">
            <NodeVotePointsSection />
            <div className="flex gap-1 mt-2 ml-[2px]">
              {/* <Button variant="ghost">
                <Share2 className="h-5 w-5" />
              </Button>
              <Button variant="ghost">
                <Star className="h-5 w-5" />
              </Button> */}
            </div>
          </div>
          <NodeAuthor
            author={node.creator!}
            updatedAt={node.updatedAt}
          />
        </div>
        <Separator className="my-2" />
        <CommentsProvider>
          <CommentSection />
        </CommentsProvider>
      </CardContent>
    </>
  )
}
