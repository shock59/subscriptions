import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  creationDate: integer("creation_date", { mode: "timestamp" }).notNull(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
});

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
});

export const channel = sqliteTable("channel", {
  id: text("id").primaryKey(),
  youtubeId: text("youtube_id").notNull().unique(),
});

export const subscriptions = sqliteTable("subscriptions", {
  id: text("id").primaryKey(),
  creationDate: integer("creation_date", { mode: "timestamp" }).notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  channelId: text("channel_id")
    .notNull()
    .references(() => channel.id),
});

export type Session = typeof session.$inferSelect;

export type User = typeof user.$inferSelect;
