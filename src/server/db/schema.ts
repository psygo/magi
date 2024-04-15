import { relations, sql } from "drizzle-orm"
import {
  integer,
  pgTableCreator,
  real,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core"

import { standardNanoid } from "./nanoid"

export const createTable = pgTableCreator(
  (name) => `magi_${name}`,
)

export const users = createTable("users", {
  // IDs
  id: serial("id").primaryKey(),
  clerkId: varchar("clerk_id", { length: 256 }).unique(),
  nanoId: varchar("nano_id", { length: 256 })
    .unique()
    .notNull()
    .$defaultFn(() => standardNanoid()),
  username: varchar("username", { length: 256 }).unique(),
  // Metadata
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at"),
  // Data
  firstName: varchar("first_name", { length: 256 }),
  lastName: varchar("last_name", { length: 256 }),
  imageUrl: varchar("image_url", { length: 1024 }),
  dummy: varchar("dummy", { length: 1024 }),
})

export const usersRelations = relations(
  users,
  ({ many }) => ({
    nodes: many(nodes),
  }),
)

export const nodes = createTable("nodes", {
  // IDs
  id: serial("id").primaryKey(),
  nanoId: varchar("nano_id", { length: 256 })
    .unique()
    .notNull(),
  // Metadata
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at"),
  // Data
  title: varchar("first_name", { length: 256 }).notNull(),
  description: varchar("last_name", { length: 4096 }),
  imageUrl: varchar("image_url", { length: 1024 }),
  x: real("x"),
  y: real("y"),
  // Relationships
  creatorId: integer("authorId"),
})

export const nodesRelations = relations(
  nodes,
  ({ one }) => ({
    creator: one(users, {
      fields: [nodes.creatorId],
      references: [users.id],
    }),
  }),
)
