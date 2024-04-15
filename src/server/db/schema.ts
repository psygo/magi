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
})

export const usersRelations = relations(
  users,
  ({ many }) => ({
    nodes: many(nodes),
    edges: many(edges),
    votes: many(votes),
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
  title: varchar("first_name", { length: 256 }).notNull(),
  description: varchar("last_name", { length: 4096 }),
  imageUrl: varchar("image_url", { length: 1024 }),
  x: real("x").notNull(),
  y: real("y").notNull(),
  // Relationships
  creatorId: integer("creator_id"),
})

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
  title: varchar("first_name", { length: 256 }).notNull(),
  description: varchar("last_name", { length: 4096 }),
  imageUrl: varchar("image_url", { length: 1024 }),
  // Relationships
  creatorId: integer("creator_id"),
  fromId: integer("from_id"),
  toId: integer("to_id"),
})

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
