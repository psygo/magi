import {
  type InferSelectModel,
  relations,
  sql,
} from "drizzle-orm"
import {
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

export type SelectUser = InferSelectModel<typeof users>
export type InsertUser = InferSelectModel<typeof users>

export const usersRelations = relations(
  users,
  ({ many }) => ({
    nodes: many(nodes),
    edges: many(edges),
    votes: many(votes),
    comments: many(comments),
  }),
)

function nodesCols() {
  return {
    // IDs
    ...idCols(),
    excalId: varchar("excal_id", { length: 256 })
      .unique()
      .notNull(),
    // Metadata
    ...dateTimeCols(),
    // Data
    title: varchar("title", { length: 256 }).notNull(),
    description: varchar("description", { length: 4096 }),
    imageUrl: varchar("image_url", { length: 1024 }),
    excalData: json("excal_data"),
    // Relationships
    creatorId: integer("creator_id").notNull(),
  }
}

export const nodes = createTable("nodes", nodesCols())

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
  ...nodesCols(),
  fromId: integer("from_id"),
  toId: integer("to_id"),
})

export type SelectEdge = InferSelectModel<typeof edges>
export type InsertEdge = InferSelectModel<typeof edges>

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

function nodeEdgeIdCols() {
  return {
    nodeId: varchar("node_id"),
    edgeId: varchar("edge_id"),
  }
}

export const votes = createTable("votes", {
  // IDs
  ...idCols(),
  // Metadata
  ...dateTimeCols(),
  // Data
  points: integer("points").notNull(),
  // Relationships
  voterId: integer("voter_id").notNull(),
  ...nodeEdgeIdCols(),
})

export type SelectVote = InferSelectModel<typeof votes>
export type InsertVote = InferSelectModel<typeof votes>

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
    edge: one(edges, {
      fields: [votes.edgeId],
      references: [edges.excalId],
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
  ...nodeEdgeIdCols(),
})

export type SelectComment = InferSelectModel<
  typeof comments
>
export type InsertComment = InferSelectModel<
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
