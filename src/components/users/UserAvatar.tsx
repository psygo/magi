import "@utils/string"

import { Avatar, AvatarFallback, AvatarImage } from "@shad"

type UserAvatarProps = {
  username?: string | null
  imageUrl?: string | null
  iconSize?: number
  fontSize?: number
}

export function UserAvatar({
  username,
  imageUrl,
  iconSize = 16,
  fontSize = 12,
}: UserAvatarProps) {
  if (!username && !imageUrl) return

  return (
    <Avatar style={{ height: iconSize, width: iconSize }}>
      <AvatarImage
        src={imageUrl ?? ""}
        alt={`@${username}`}
      />
      <AvatarFallback style={{ fontSize: fontSize }}>
        {username?.first().toUpperCase()}
      </AvatarFallback>
    </Avatar>
  )
}
