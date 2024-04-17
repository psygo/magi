import "server-only"

import { headers } from "next/headers"
import { NextResponse } from "next/server"

import { Webhook } from "svix"

import {
  type WebhookEvent,
  clerkClient,
} from "@clerk/nextjs/server"

import { eq } from "drizzle-orm"

import {
  type Username,
  type ClerkId,
  type Email,
} from "@types"

import { db, users } from "@server"

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
      const type = verifiedPayload.type
      let data

      switch (type) {
        case "user.created":
          data = verifiedPayload.data
          await createUser(
            data.id,
            data.username!,
            // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
            data.email_addresses[0]?.email_address!,
          )
          break
        case "user.updated":
          data = verifiedPayload.data
          await updateUser(data.id, data.username!)
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

async function createUser(
  clerkId: ClerkId,
  username: Username,
  email: Email,
) {
  try {
    const newUserNanoId = await db
      .insert(users)
      .values({
        clerkId,
        username,
        email,
      })
      .returning({ insertedNanoId: users.nanoId })

    if (newUserNanoId)
      await clerkClient.users.updateUser(clerkId, {
        publicMetadata: {
          nanoid: newUserNanoId,
          isAdmin: false,
          isWriter: false,
        },
      })

    return newUserNanoId
  } catch (e) {
    console.error(e)
  }
}

async function updateUser(
  clerkId: ClerkId,
  username: Username,
) {
  try {
    await db
      .update(users)
      .set({
        username,
      })
      .where(eq(users.clerkId, clerkId))
  } catch (e) {
    console.error(e)
  }
}
