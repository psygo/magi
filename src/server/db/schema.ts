import { relations, sql } from "drizzle-orm"
import {
  boolean,
  integer,
  json,
  pgTableCreator,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core"

import { standardNanoid } from "./nanoid"

export const createTable = pgTableCreator(
  (name) => `magi_${name}`,
)

function idCols() {
  return {
    id: serial("id").primaryKey(),
    nanoId: varchar("nano_id", { length: 256 })
      .unique()
      .notNull()
      .$defaultFn(() => standardNanoid()),
  }
}

function dateTimeCols() {
  return {
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  }
}

function imageUrlCol() {
  return {
    imageUrl: varchar("image_url", { length: 1024 }),
  }
}

export const users = createTable("users", {
  // IDs
  ...idCols(),
  clerkId: varchar("clerk_id", { length: 256 })
    .unique()
    .notNull(),
  username: varchar("username", { length: 256 })
    .unique()
    .notNull(),
  email: varchar("email", { length: 256 })
    .unique()
    .notNull(),
  // Metadata
  ...dateTimeCols(),
  // Data
  firstName: varchar("first_name", { length: 256 }),
  lastName: varchar("last_name", { length: 256 }),
  ...imageUrlCol(),
})

export const usersRelations = relations(
  users,
  ({ many }) => ({
    canvases: many(canvases),
    nodes: many(nodes),
    votes: many(votes),
    comments: many(comments),
  }),
)

export const canvases = createTable("canvases", {
  // IDs
  ...idCols(),
  // Metadata
  ...dateTimeCols(),
  // Data
  title: varchar("title", { length: 256 }).notNull(),
  description: varchar("description", {
    length: 4096,
  }).notNull(),
  isDeleted: boolean("is_deleted").notNull().default(false),
  isPrivate: boolean("is_private").notNull().default(false),
  isUnlisted: boolean("is_unlisted")
    .notNull()
    .default(false),
  // Relationships
  ownerId: integer("creator_id").notNull(),
})

export const canvasesRelations = relations(
  canvases,
  ({ one, many }) => ({
    owner: one(users, {
      fields: [canvases.ownerId],
      references: [users.id],
    }),
    nodes: many(nodes),
  }),
)

export const nodes = createTable("nodes", {
  // IDs
  ...idCols(),
  excalId: varchar("excal_id", { length: 256 })
    .unique()
    .notNull(),
  // Metadata
  ...dateTimeCols(),
  // Data
  title: varchar("title", { length: 256 }).notNull(),
  description: varchar("description", {
    length: 4096,
  }).notNull(),
  imageUrl: varchar("image_url", { length: 1024 }),
  excalData: json("excal_data"),
  isDeleted: boolean("is_deleted").notNull().default(false),
  // Relationships
  creatorId: integer("creator_id").notNull(),
  canvasId: integer("canvas_id"),
  fromId: varchar("from_id"),
  toId: varchar("to_id"),
})

export const nodesRelations = relations(
  nodes,
  ({ one, many }) => ({
    creator: one(users, {
      fields: [nodes.creatorId],
      references: [users.id],
    }),
    canvas: one(canvases, {
      fields: [nodes.canvasId],
      references: [canvases.id],
    }),
    votes: many(votes),
    comments: many(comments),
    from: many(nodes, { relationName: "from" }),
    to: many(nodes, { relationName: "to" }),
    fromOrigin: one(nodes, {
      fields: [nodes.fromId],
      references: [nodes.excalId],
      relationName: "from",
    }),
    toOrigin: one(nodes, {
      fields: [nodes.toId],
      references: [nodes.excalId],
      relationName: "to",
    }),
  }),
)

export const votes = createTable("votes", {
  // IDs
  ...idCols(),
  // Metadata
  ...dateTimeCols(),
  // Data
  points: integer("points").notNull(),
  // Relationships
  voterId: integer("voter_id").notNull(),
  nodeId: varchar("node_id"),
})

export const votesRelations = relations(
  votes,
  ({ one }) => ({
    creator: one(users, {
      fields: [votes.voterId],
      references: [users.id],
    }),
    node: one(nodes, {
      fields: [votes.nodeId],
      references: [nodes.excalId],
    }),
  }),
)

export const comments = createTable("comments", {
  // IDs
  ...idCols(),
  // Metadata
  ...dateTimeCols(),
  // Data
  content: varchar("content", { length: 4096 }),
  // Relationships
  commenterId: integer("commenter_id").notNull(),
  nodeId: varchar("node_id"),
})

export const commentsRelations = relations(
  comments,
  ({ one }) => ({
    creator: one(users, {
      fields: [comments.commenterId],
      references: [users.id],
    }),
    node: one(nodes, {
      fields: [comments.nodeId],
      references: [nodes.excalId],
    }),
  }),
)
