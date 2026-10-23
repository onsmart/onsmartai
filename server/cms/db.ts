import { and, desc, eq, inArray, isNotNull, ne } from "drizzle-orm";
import { getDb } from "../db";
import { ENV } from "../_core/env";
import {
  cmsAudit,
  cmsDocuments,
  cmsGrants,
  cmsMedia,
  users,
  type CmsAuditRow,
  type CmsDocument as CmsDocumentRow,
  type CmsGrant,
  type CmsMediaRow,
} from "../../drizzle/schema";
import type {
  CmsAudit,
  CmsDocument,
  CmsKind,
  CmsLocale,
  CmsMedia,
  CmsPayload,
  CmsRole,
  CmsStatus,
  PublishedDocument,
} from "@shared/cms";
import { CmsPayloadSchema } from "@shared/cms";
import {
  assertApprovedLocks,
  assertStructuredKind,
  assertPayloadSize,
  assertPublishable,
  CmsConflictError,
  CmsValidationError,
  isoDate,
  parseCmsSaveRequest,
} from "./validation";

export type CmsSeedRecord = {
  key: string;
  kind: CmsKind;
  locale: CmsLocale;
  slug: string;
  payload: CmsPayload;
  status: CmsStatus;
};

type Db = NonNullable<Awaited<ReturnType<typeof getDb>>>;

export async function requireCmsDb(): Promise<Db> {
  const db = await getDb();
  if (!db) throw new Error("CMS database is unavailable");
  return db;
}

function parseStoredPayload(value: string | null): CmsPayload | null {
  if (value === null) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(value);
  } catch {
    throw new Error("CMS stored payload is invalid");
  }
  const result = CmsPayloadSchema.safeParse(parsed);
  if (!result.success) throw new Error("CMS stored payload is invalid");
  return result.data as CmsPayload;
}

export function toCmsDocument(row: CmsDocumentRow): CmsDocument {
  const draft = parseStoredPayload(row.draftPayload);
  if (!draft) throw new Error("CMS document has no draft payload");
  return {
    id: row.id,
    key: row.key,
    kind: row.kind as CmsKind,
    locale: row.locale as CmsLocale,
    slug: row.slug,
    title: draft.title,
    status: row.status as CmsStatus,
    draft,
    published: parseStoredPayload(row.publishedPayload),
    revision: row.revision,
    updatedAt: isoDate(row.updatedAt),
    hasPublished: row.publishedPayload !== null,
  };
}

export function toPublishedDocument(
  row: CmsDocumentRow
): PublishedDocument | null {
  if (row.publishedPayload === null || row.status === "archived") return null;
  const payload = parseStoredPayload(row.publishedPayload);
  if (!payload) return null;
  try {
    assertStructuredKind(row.kind as CmsKind, payload, row.slug);
  } catch {
    return null;
  }
  return {
    id: row.id,
    key: row.key,
    kind: row.kind as CmsKind,
    locale: row.locale as CmsLocale,
    slug: row.slug,
    payload,
  };
}

export async function getCmsDocument(id: number): Promise<CmsDocument | null> {
  const db = await requireCmsDb();
  const rows = await db
    .select()
    .from(cmsDocuments)
    .where(eq(cmsDocuments.id, id))
    .limit(1);
  return rows.length ? toCmsDocument(rows[0]) : null;
}

export async function listCmsDocuments(): Promise<CmsDocument[]> {
  const db = await requireCmsDb();
  const rows = await db
    .select()
    .from(cmsDocuments)
    .orderBy(desc(cmsDocuments.updatedAt), desc(cmsDocuments.id));
  return rows.map(toCmsDocument);
}

/** Public SSR/client helper: only published snapshots, with no access records or drafts. */
export async function getPublishedDocuments(): Promise<PublishedDocument[]> {
  const db = await requireCmsDb();
  const rows = await db
    .select()
    .from(cmsDocuments)
    .where(
      and(
        isNotNull(cmsDocuments.publishedPayload),
        ne(cmsDocuments.status, "archived")
      )
    )
    .orderBy(desc(cmsDocuments.updatedAt), desc(cmsDocuments.id));
  return rows
    .map(toPublishedDocument)
    .filter((row): row is PublishedDocument => row !== null);
}

export async function getCmsGrantByUserId(
  userId: number
): Promise<CmsGrant | null> {
  const db = await requireCmsDb();
  const rows = await db
    .select()
    .from(cmsGrants)
    .where(eq(cmsGrants.userId, userId))
    .limit(1);
  return rows.length ? rows[0] : null;
}

export type CmsUserRow = {
  id: number;
  openId: string;
  name: string | null;
  email: string | null;
  grantRole: CmsRole | null;
};

export async function listCmsUsers(): Promise<CmsUserRow[]> {
  const db = await requireCmsDb();
  const rows = await db
    .select({
      id: users.id,
      openId: users.openId,
      name: users.name,
      email: users.email,
      grantRole: cmsGrants.role,
    })
    .from(users)
    .leftJoin(cmsGrants, eq(cmsGrants.userId, users.id))
    .orderBy(desc(users.lastSignedIn), desc(users.id));
  return rows.map(row => ({
    ...row,
    grantRole: (row.grantRole as CmsRole | null) ?? null,
  }));
}

export async function getUserByOpenIdForCms(
  openId: string
): Promise<{
  id: number;
  openId: string;
  name: string | null;
  email: string | null;
} | null> {
  const db = await requireCmsDb();
  const rows = await db
    .select({
      id: users.id,
      openId: users.openId,
      name: users.name,
      email: users.email,
    })
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);
  return rows.length ? rows[0] : null;
}

export async function listCmsAdminOpenIds(): Promise<string[]> {
  const db = await requireCmsDb();
  const rows = await db
    .select({ openId: users.openId })
    .from(cmsGrants)
    .innerJoin(users, eq(users.id, cmsGrants.userId))
    .where(eq(cmsGrants.role, "admin"));
  return rows.map(row => row.openId);
}

async function writeCmsAudit(
  db: Db,
  documentId: number | null,
  actor: string,
  action: string,
  revision: number | null,
  snapshot: unknown,
  note = ""
): Promise<void> {
  await db.insert(cmsAudit).values({
    documentId,
    actor: actor.slice(0, 320),
    action,
    revision,
    snapshot: snapshot === undefined ? null : JSON.stringify(snapshot),
    note: note.slice(0, 2000),
  });
}

/**
 * Explicit access-grant helper for a parent/admin flow. It only changes an
 * identity that already exists in users; it never creates a first user or a
 * synthetic authentication claim.
 */
export async function setCmsAccess(
  openId: string,
  role: CmsRole | null,
  actor: string
): Promise<CmsUserRow> {
  if (!openId || /\s/.test(openId))
    throw new CmsValidationError("openId inválido.");
  if (role !== null && role !== "admin" && role !== "editor")
    throw new CmsValidationError("role inválido.");
  const db = await requireCmsDb();
  const targetRows = await db
    .select({
      id: users.id,
      openId: users.openId,
      name: users.name,
      email: users.email,
    })
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);
  if (!targetRows.length)
    throw new CmsValidationError(
      "A identidade precisa ter feito login antes de receber acesso CMS."
    );
  if (ENV.ownerOpenId && openId === ENV.ownerOpenId && role !== "admin") {
    throw new CmsValidationError(
      "O proprietário configurado não pode perder acesso de administrador."
    );
  }
  if (role !== "admin") {
    const administrators = new Set(await listCmsAdminOpenIds());
    if (ENV.ownerOpenId) administrators.add(ENV.ownerOpenId);
    if (administrators.size <= 1 && administrators.has(openId)) {
      throw new CmsConflictError(
        "O último administrador não pode perder o próprio acesso."
      );
    }
  }
  const target = targetRows[0];
  if (role === null) {
    await db.delete(cmsGrants).where(eq(cmsGrants.userId, target.id));
  } else {
    await db
      .insert(cmsGrants)
      .values({ userId: target.id, role })
      .onDuplicateKeyUpdate({
        set: { role, updatedAt: new Date() },
      });
  }
  await writeCmsAudit(
    db,
    null,
    actor,
    role ? `grant_${role}` : "revoke_access",
    null,
    undefined,
    openId
  );
  return { ...target, grantRole: role };
}

export async function getCmsMedia(id: number): Promise<CmsMedia | null> {
  const db = await requireCmsDb();
  const rows = await db
    .select()
    .from(cmsMedia)
    .where(eq(cmsMedia.id, id))
    .limit(1);
  return rows.length ? toCmsMedia(rows[0]) : null;
}

export async function listCmsMedia(includeHidden = false): Promise<CmsMedia[]> {
  const db = await requireCmsDb();
  const rows = includeHidden
    ? await db
        .select()
        .from(cmsMedia)
        .orderBy(desc(cmsMedia.createdAt), desc(cmsMedia.id))
    : await db
        .select()
        .from(cmsMedia)
        .where(eq(cmsMedia.hidden, 0))
        .orderBy(desc(cmsMedia.createdAt), desc(cmsMedia.id));
  return rows.map(toCmsMedia);
}

export function toCmsMedia(row: CmsMediaRow): CmsMedia {
  return {
    id: row.id,
    key: row.key,
    url: row.url,
    name: row.name,
    mime: row.mime,
    size: row.size,
    alt: row.alt,
    title: row.title,
    createdAt: isoDate(row.createdAt),
    hidden: row.hidden === 1,
  };
}

export function toCmsAudit(row: CmsAuditRow): CmsAudit {
  return {
    id: row.id,
    documentId: row.documentId,
    action: row.action,
    actor: row.actor,
    createdAt: isoDate(row.createdAt),
    note: row.note,
  };
}

export async function listCmsAudit(): Promise<CmsAudit[]> {
  const db = await requireCmsDb();
  const rows = await db
    .select()
    .from(cmsAudit)
    .orderBy(desc(cmsAudit.createdAt), desc(cmsAudit.id))
    .limit(500);
  return rows.map(toCmsAudit);
}

function seedStatus(status: CmsStatus): CmsStatus {
  return status === "published" || status === "review" || status === "archived"
    ? status
    : "draft";
}

/**
 * Insert-only seed helper. It never overwrites a key/locale already present, so a
 * later seed cannot destroy editorial changes. The parent seed script calls this
 * explicitly after migrations; startup never calls it.
 */
export async function seedCms(
  records: CmsSeedRecord[]
): Promise<CmsDocument[]> {
  const db = await requireCmsDb();
  const inserted: CmsDocument[] = [];
  for (const record of records) {
    const parsed = parseCmsSaveRequest({
      key: record.key,
      kind: record.kind,
      locale: record.locale,
      slug: record.slug,
      payload: record.payload,
    });
    assertPayloadSize(parsed.payload);
    assertApprovedLocks(parsed.key, parsed.payload);
    const status = seedStatus(record.status);
    if (status === "published") {
      assertPublishable(parsed.kind, parsed.payload);
    }
    const existing = await db
      .select()
      .from(cmsDocuments)
      .where(
        and(
          eq(cmsDocuments.key, parsed.key),
          eq(cmsDocuments.locale, parsed.locale)
        )
      )
      .limit(1);
    if (existing.length) continue;
    const serialized = JSON.stringify(parsed.payload);
    const result = await db.insert(cmsDocuments).values({
      key: parsed.key,
      kind: parsed.kind,
      locale: parsed.locale,
      slug: parsed.slug,
      status,
      draftPayload: serialized,
      publishedPayload: status === "published" ? serialized : null,
      revision: 1,
    });
    const insertId = Number(
      (result as any).insertId ?? (result as any)[0]?.insertId ?? 0
    );
    const created = insertId
      ? await db
          .select()
          .from(cmsDocuments)
          .where(eq(cmsDocuments.id, insertId))
          .limit(1)
      : await db
          .select()
          .from(cmsDocuments)
          .where(
            and(
              eq(cmsDocuments.key, parsed.key),
              eq(cmsDocuments.locale, parsed.locale)
            )
          )
          .limit(1);
    if (created.length) inserted.push(toCmsDocument(created[0]));
  }
  return inserted;
}

/** Helper for tests and callers that need to validate a stored payload before a write. */
export function validateCmsPayloadForWrite(payload: unknown): CmsPayload {
  const parsed = CmsPayloadSchema.parse(payload) as CmsPayload;
  assertPayloadSize(parsed);
  return parsed;
}

export {
  and,
  desc,
  eq,
  inArray,
  cmsAudit,
  cmsDocuments,
  cmsGrants,
  cmsMedia,
  users,
};
