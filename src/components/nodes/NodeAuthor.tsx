import { type SelectUserWithStats } from "@types"

import { cn, pointsColor } from "@styles"

import { UserAvatar } from "../users/exports"

type NodeAuthorProps = {
  author: SelectUserWithStats
}

export function NodeAuthor({ author }: NodeAuthorProps) {
  const points = author.stats!.voteTotal

  return (
    <div className="flex gap-2 items-center">
      <p>by</p>
      <UserAvatar
        username={author.username}
        imageUrl={author.imageUrl}
        iconSize={24}
        fontSize={14}
      />
      <h6 className="text-md text-blue-500">
        @{author.username}
      </h6>
      <h6 className={cn("text-md", pointsColor(points))}>
        {points}
      </h6>
    </div>
  )
}
