import "@utils/string"

import { Avatar, AvatarFallback, AvatarImage } from "@shad"

type UserAvatarProps = {
  username: string | null | undefined
  imageUrl: string | null | undefined
  zoom?: number
  iconSize?: number
  fontSize?: number
}

export function UserAvatar({
  username,
  imageUrl,
  iconSize = 18,
  fontSize = 12,
  zoom = 1,
}: UserAvatarProps) {
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
