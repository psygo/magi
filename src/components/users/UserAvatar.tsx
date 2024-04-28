import "@utils/string"

import { useUser } from "@clerk/nextjs"

import { type ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types"

import { Avatar, AvatarFallback, AvatarImage } from "@shad"

import { useCanvas } from "@context"

type UserAvatarProps = {
  excalEl: ExcalidrawElement
  iconSize?: number
  fontSize?: number
}

export function UserAvatar({
  excalEl,
  iconSize = 16,
  fontSize = 12,
}: UserAvatarProps) {
  const { user } = useUser()

  const { nodes, excalAppState } = useCanvas()
  const node = nodes[excalEl.id]

  const zoom = excalAppState.zoom.value

  const username = node?.creator?.username ?? user?.username
  const imageUrl = node?.creator?.imageUrl ?? user?.imageUrl

  const zoomedIconSize = iconSize * zoom
  const zoomedFontSize = (fontSize * zoom) / 2

  const params = new URLSearchParams()
  params.set("height", "100")
  params.set("width", "100")
  params.set("quality", "100")
  params.set("fit", "crop")

  return (
    <Avatar
      style={{
        height: zoomedIconSize,
        width: zoomedIconSize,
      }}
    >
      <AvatarImage
        src={`${imageUrl}?${params.toString()}` ?? ""}
        alt={`@${username}`}
      />
      <AvatarFallback style={{ fontSize: zoomedFontSize }}>
        {username?.first().toUpperCase()}
      </AvatarFallback>
    </Avatar>
  )
}
