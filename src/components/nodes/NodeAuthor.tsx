import { type SelectUserWithStats } from "@types"

import { cn, pointsColor } from "@styles"

import { UserAvatar } from "../users/exports"

import { Card, CardContent } from "@shad"

type NodeAuthorProps = {
  author: SelectUserWithStats
  updatedAt: Date
}

export function NodeAuthor({
  author,
  updatedAt,
}: NodeAuthorProps) {
  const points = author.stats!.voteTotal ?? 0

  return (
    <Card>
      <CardContent className="flex flex-col gap-2 p-3">
        <NodeDate updatedAt={updatedAt} />
        <div className="flex gap-3 items-center pl-1">
          <UserAvatar
            username={author.username}
            imageUrl={author.imageUrl}
            iconSize={44}
            fontSize={14}
          />
          <div className="flex flex-col gap-1">
            <h6 className="text-md text-blue-500 font-bold">
              {author.username}
            </h6>
            <h6
              className={cn(
                "text-md font-bold",
                pointsColor(points),
              )}
            >
              {points}
            </h6>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

type NodeDateProps = {
  updatedAt: Date
}

export function NodeDate({ updatedAt }: NodeDateProps) {
  return (
    <div>
      <p className="text-xs text-gray-500">
        updated at{" "}
        {updatedAt.toLocaleString("en-us", {
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        })}
      </p>
    </div>
  )
}
