import {
  index,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/** CMS access is deliberately separate from the starter users.role enum. */
export const cmsGrants = mysqlTable(
  "cms_grants",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    role: mysqlEnum("role", ["admin", "editor"]).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => ({
    userUnique: uniqueIndex("cms_grants_user_unique").on(table.userId),
    roleIndex: index("cms_grants_role_idx").on(table.role),
  }),
);

export const cmsDocuments = mysqlTable(
  "cms_documents",
  {
    id: int("id").autoincrement().primaryKey(),
    key: varchar("key", { length: 180 }).notNull(),
    kind: mysqlEnum("kind", [
      "page",
      "landing",
      "article",
      "news",
      "case",
      "video",
      "material",
      "banner",
    ]).notNull(),
    locale: mysqlEnum("locale", ["pt-BR", "en", "es"]).notNull(),
    slug: varchar("slug", { length: 220 }).notNull(),
    status: mysqlEnum("status", ["draft", "review", "published", "archived"])
      .notNull()
      .default("draft"),
    draftPayload: text("draftPayload").notNull(),
    publishedPayload: text("publishedPayload"),
    revision: int("revision").notNull().default(1),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => ({
    keyLocaleUnique: uniqueIndex("cms_documents_key_locale_unique").on(
      table.key,
      table.locale,
    ),
    statusIndex: index("cms_documents_status_idx").on(table.status),
    slugLocaleIndex: index("cms_documents_slug_locale_idx").on(
      table.slug,
      table.locale,
    ),
  }),
);

export const cmsMedia = mysqlTable(
  "cms_media",
  {
    id: int("id").autoincrement().primaryKey(),
    key: varchar("key", { length: 255 }).notNull().unique(),
    url: varchar("url", { length: 2048 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    mime: varchar("mime", { length: 100 }).notNull(),
    size: int("size").notNull(),
    alt: varchar("alt", { length: 300 }).notNull().default(""),
    title: varchar("title", { length: 300 }).notNull().default(""),
    hidden: int("hidden").notNull().default(0),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => ({
    visibleIndex: index("cms_media_hidden_idx").on(table.hidden),
  }),
);

export const cmsAudit = mysqlTable(
  "cms_audit",
  {
    id: int("id").autoincrement().primaryKey(),
    documentId: int("documentId"),
    action: varchar("action", { length: 80 }).notNull(),
    actor: varchar("actor", { length: 320 }).notNull(),
    revision: int("revision"),
    /** Internal snapshot retained for revision history; never returned by public APIs. */
    snapshot: text("snapshot"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    note: text("note").notNull(),
  },
  table => ({
    documentIndex: index("cms_audit_document_idx").on(table.documentId),
    createdIndex: index("cms_audit_created_idx").on(table.createdAt),
  }),
);

export type CmsGrant = typeof cmsGrants.$inferSelect;
export type CmsDocument = typeof cmsDocuments.$inferSelect;
export type CmsMediaRow = typeof cmsMedia.$inferSelect;
export type CmsAuditRow = typeof cmsAudit.$inferSelect;
