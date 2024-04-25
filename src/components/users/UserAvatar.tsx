import "@utils/string"

import { Avatar, AvatarFallback, AvatarImage } from "@shad"

type UserAvatarProps = {
  username?: string | null
  imageUrl?: string | null
}

export function UserAvatar({
  username,
  imageUrl,
}: UserAvatarProps) {
  if (!username && !imageUrl) return

  return (
    <Avatar style={{ height: 16, width: 16 }}>
      <AvatarImage
        src={imageUrl ?? ""}
        alt={`@${username}`}
      />
      <AvatarFallback style={{ fontSize: 12 }}>
        {username?.first().toUpperCase()}
      </AvatarFallback>
    </Avatar>
  )
}
