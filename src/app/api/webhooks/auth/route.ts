import { Webhook } from "svix"

import { type WebhookEvent } from "@clerk/nextjs/server"
import {} from "@clerk/nextjs"

import { headers } from "next/headers"
import { NextResponse } from "next/server"

// import { type ClerkId } from "@types"

const clerkWebhooksUserEventsSecret =
  process.env.CLERK_WEBHOOKS_USER_EVENTS!

async function validateRequest(request: Request) {
  try {
    const payloadString = await request.text()
    const headerPayload = headers()

    const svixHeaders = {
      "svix-id": headerPayload.get("svix-id")!,
      "svix-timestamp": headerPayload.get(
        "svix-timestamp",
      )!,
      "svix-signature": headerPayload.get(
        "svix-signature",
      )!,
    }

    const wh = new Webhook(clerkWebhooksUserEventsSecret)

    return wh.verify(
      payloadString,
      svixHeaders,
    ) as WebhookEvent
  } catch (e) {
    console.error(e)
  }
}

export async function POST(req: Request) {
  try {
    const verifiedPayload = await validateRequest(req)

    if (verifiedPayload) {
      // const data = verifiedPayload.data
      const type = verifiedPayload.type

      switch (type) {
        case "user.created":
          // await createUser(verifiedPayload.data.id)
          break
        case "user.updated":
          // await updateUser(data)
          break
        case "user.deleted":
          // await deleteUser(data)
          break
        default:
          console.log(`${type} is not a managed event.`)
      }
    }

    return NextResponse.json({})
  } catch (e) {
    console.error(e)
  }
}

// async function createUser(clerkId: ClerkId) {
// try {
//     // const user = await prisma.user.create({
//     //   data: {
//     //     nanoid: standardNanoid(),
//     //     clerkId: userData.id,
//     //     username: userData.username!,
//     //     email:
//     //       userData.email_addresses.first().email_address,
//     //   },
//     // })
//     // await clerkClient.users.updateUser(userData.id, {
//     //   publicMetadata: {
//     //     nanoid: user?.nanoid,
//     //     isAdmin: false,
//     //     isWriter: false,
//     //   },
//     // })
//     // return user
// } catch (e) {
//   console.error(e)
// }
// }

// async function updateUser(userData: UserJSON) {
//   try {
//   } catch (e) {
//     console.error(e)
//   }
// }

// async function deleteUser(userData: UserJSON) {
//   try {
//   } catch (e) {
//     console.error(e)
//   }
// }
