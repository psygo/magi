import {
  type InferSelectModel,
  relations,
  sql,
} from "drizzle-orm"
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
  clerkId: varchar("clerk_id", { length: 256 })
    .unique()
    .notNull(),
  nanoId: varchar("nano_id", { length: 256 })
    .unique()
    .notNull()
    .$defaultFn(() => standardNanoid()),
  username: varchar("username", { length: 256 })
    .unique()
    .notNull(),
  email: varchar("email", { length: 256 })
    .unique()
    .notNull(),
  // Metadata
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at"),
  // Data
  firstName: varchar("first_name", { length: 256 }),
  lastName: varchar("last_name", { length: 256 }),
  imageUrl: varchar("image_url", { length: 1024 }),
})

export type SelectUsers = InferSelectModel<typeof users>
export type InsertUsers = InferSelectModel<typeof users>

export const usersRelations = relations(
  users,
  ({ many }) => ({
    nodes: many(nodes),
    edges: many(edges),
    votes: many(votes),
    comments: many(comments),
  }),
)

export const nodes = createTable("nodes", {
  // IDs
  id: serial("id").primaryKey(),
  nanoId: varchar("nano_id", { length: 256 })
    .unique()
    .notNull()
    .$defaultFn(() => standardNanoid()),
  // Metadata
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at"),
  // Data
  title: varchar("title", { length: 256 }).notNull(),
  description: varchar("description", { length: 4096 }),
  imageUrl: varchar("image_url", { length: 1024 }),
  x: real("x").notNull(),
  y: real("y").notNull(),
  // Relationships
  creatorId: integer("creator_id"),
})

export type SelectNode = InferSelectModel<typeof nodes>
export type InsertNode = InferSelectModel<typeof nodes>

export const nodesRelations = relations(
  nodes,
  ({ one, many }) => ({
    creator: one(users, {
      fields: [nodes.creatorId],
      references: [users.id],
    }),
    edges: many(edges, { relationName: "from" }),
    to: many(edges, { relationName: "to" }),
    votes: many(votes),
    comments: many(comments),
  }),
)

export const edges = createTable("edges", {
  // IDs
  id: serial("id").primaryKey(),
  nanoId: varchar("nano_id", { length: 256 })
    .unique()
    .notNull()
    .$defaultFn(() => standardNanoid()),
  // Metadata
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at"),
  // Data
  title: varchar("title", { length: 256 }).notNull(),
  description: varchar("description", { length: 4096 }),
  imageUrl: varchar("image_url", { length: 1024 }),
  // Relationships
  creatorId: integer("creator_id"),
  fromId: integer("from_id"),
  toId: integer("to_id"),
})

export type SelectEdges = InferSelectModel<typeof edges>
export type InsertEdges = InferSelectModel<typeof edges>

export const edgesRelations = relations(
  edges,
  ({ one, many }) => ({
    creator: one(users, {
      fields: [edges.creatorId],
      references: [users.id],
    }),
    from: one(nodes, {
      fields: [edges.fromId],
      references: [nodes.id],
      relationName: "from",
    }),
    to: one(nodes, {
      fields: [edges.toId],
      references: [nodes.id],
      relationName: "to",
    }),
    votes: many(votes),
    comments: many(comments),
  }),
)

export const votes = createTable("votes", {
  // IDs
  id: serial("id").primaryKey(),
  nanoId: varchar("nano_id", { length: 256 })
    .unique()
    .notNull()
    .$defaultFn(() => standardNanoid()),
  // Metadata
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at"),
  // Data
  points: integer("points").notNull(),
  // Relationships
  voterId: integer("voter_id").notNull(),
  nodeId: integer("node_id"),
  edgeId: integer("edge_id"),
})

export type SelectVotes = InferSelectModel<typeof votes>
export type InsertVotes = InferSelectModel<typeof votes>

export const votesRelations = relations(
  votes,
  ({ one }) => ({
    creator: one(users, {
      fields: [votes.voterId],
      references: [users.id],
    }),
    node: one(nodes, {
      fields: [votes.nodeId],
      references: [nodes.id],
    }),
    edge: one(edges, {
      fields: [votes.edgeId],
      references: [edges.id],
    }),
  }),
)

export const comments = createTable("comments", {
  // IDs
  id: serial("id").primaryKey(),
  nanoId: varchar("nano_id", { length: 256 })
    .unique()
    .notNull()
    .$defaultFn(() => standardNanoid()),
  // Metadata
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at"),
  // Data
  content: varchar("content", { length: 4096 }),
  // Relationships
  commenterId: integer("commenter_id").notNull(),
  nodeId: integer("node_id"),
  edgeId: integer("edge_id"),
})

export type SelectComments = InferSelectModel<
  typeof comments
>
export type InsertComments = InferSelectModel<
  typeof comments
>

export const commentsRelations = relations(
  comments,
  ({ one }) => ({
    creator: one(users, {
      fields: [comments.commenterId],
      references: [users.id],
    }),
    node: one(nodes, {
      fields: [comments.nodeId],
      references: [nodes.id],
    }),
    edge: one(edges, {
      fields: [comments.edgeId],
      references: [edges.id],
    }),
  }),
)
