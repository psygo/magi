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

import "@utils/array"

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

      switch (type) {
        case "user.created":
          const userCreatedData = verifiedPayload.data
          const email =
            userCreatedData.email_addresses[0]!
              .email_address
          await createUser(
            userCreatedData.id,
            userCreatedData.username!,
            email,
            userCreatedData.image_url,
          )
          break
        case "user.updated":
          const userUpdatedData = verifiedPayload.data
          await updateUser(
            userUpdatedData.id,
            userUpdatedData.username!,
            userUpdatedData.image_url,
          )
          break
        case "user.deleted":
          const userDeletedData = verifiedPayload.data
          await deleteUser(userDeletedData.id!)
          break
        default:
          console.error(`${type} is not a managed event.`)
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
  imageUrl: string,
) {
  try {
    const usersData = await db
      .insert(users)
      .values({
        clerkId,
        username,
        email,
        imageUrl,
      })
      .returning({ id: users.id, nanoId: users.nanoId })

    if (usersData) {
      const userData = usersData.first()

      await clerkClient.users.updateUser(clerkId, {
        publicMetadata: {
          nanoid: userData.nanoId,
        },
        privateMetadata: {
          id: userData.id,
          isAdmin: false,
        },
      })
    }
  } catch (e) {
    console.error(e)
  }
}

async function updateUser(
  clerkId: ClerkId,
  username: Username,
  imageUrl: string,
) {
  try {
    await db
      .update(users)
      .set({
        username,
        imageUrl,
      })
      .where(eq(users.clerkId, clerkId))
  } catch (e) {
    console.error(e)
  }
}

async function deleteUser(clerkId: ClerkId) {
  try {
    await db.delete(users).where(eq(users.clerkId, clerkId))
  } catch (e) {
    console.error(e)
  }
}
