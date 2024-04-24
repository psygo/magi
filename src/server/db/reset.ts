import "server-only"

import { db } from "."
import { comments, nodes, users, votes } from "./schema"
import { mockUsers } from "./mock"

type ResetOptions = DeleteOptions & {
  mock?: boolean
}

export async function reset(
  options: ResetOptions = {
    deleteUsers: false,
    deleteNodes: false,
    mock: false,
  },
) {
  try {
    await deleteEverything(options)

    if (options.mock) await mockUsers()
  } catch (e) {
    console.error(e)
  }
}

type DeleteOptions = {
  deleteUsers?: boolean
  deleteNodes?: boolean
}

async function deleteEverything(
  options: DeleteOptions = {
    deleteUsers: false,
    deleteNodes: false,
  },
) {
  try {
    if (options.deleteNodes) {
      // eslint-disable-next-line drizzle/enforce-delete-with-where
      await db.delete(comments)
      // eslint-disable-next-line drizzle/enforce-delete-with-where
      await db.delete(votes)
      // eslint-disable-next-line drizzle/enforce-delete-with-where
      await db.delete(nodes)
    }
    if (options.deleteUsers)
      // eslint-disable-next-line drizzle/enforce-delete-with-where
      await db.delete(users)
  } catch (e) {
    console.error(e)
  }
}
