import { currentUser } from "@clerk/nextjs/server"

export async function userIdFromClerk() {
  try {
    const user = await currentUser()

    if (!user) return

    const userId = user.privateMetadata.id as number

    return userId
  } catch (e) {
    console.error(e)
  }
}
