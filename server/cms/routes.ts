import { randomUUID } from "node:crypto";
import { Router, type Express, type Request, type Response } from "express";
import { and, desc, eq } from "drizzle-orm";
import { sdk, type AuthenticatedUser } from "../_core/sdk";
import { ENV } from "../_core/env";
import { storagePut } from "../storage";
import {
  assertApprovedLocks,
  assertStructuredKind,
  assertCmsCsrf,
  assertPayloadSize,
  assertPublishable,
  CmsConflictError,
  CmsCsrfError,
  CmsValidationError,
  isoDate,
  parseAccessRequest,
  parseCmsActionRequest,
  parseCmsSaveRequest,
  parseMediaUpdate,
  parseMediaUpload,
} from "./validation";
import {
  cmsAudit,
  cmsDocuments,
  cmsGrants,
  cmsMedia,
  getCmsDocument,
  getCmsGrantByUserId,
  getCmsMedia,
  getPublishedDocuments,
  getUserByOpenIdForCms,
  listCmsAdminOpenIds,
  listCmsAudit,
  listCmsDocuments,
  listCmsMedia,
  listCmsUsers,
  requireCmsDb,
  toCmsDocument,
  toCmsMedia,
} from "./db";
import type { CmsRole, CmsUser } from "@shared/cms";

class CmsHttpError extends Error {
  constructor(
    readonly status: number,
    message: string
  ) {
    super(message);
    this.name = "CmsHttpError";
  }
}

type CmsAuth = {
  user: AuthenticatedUser;
  role: CmsRole | null;
  isOwner: boolean;
};

function jsonOk(res: Response, data: unknown, status = 200) {
  res.set("Cache-Control", "no-store");
  return res.status(status).json({ data });
}

function jsonError(res: Response, error: unknown) {
  const status =
    error instanceof CmsHttpError ||
    error instanceof CmsValidationError ||
    error instanceof CmsConflictError ||
    error instanceof CmsCsrfError
      ? error.status
      : 500;
  // Detailed storage/database/auth errors never cross the CMS boundary.
  const message =
    status >= 500
      ? "Erro interno do CMS."
      : error instanceof Error
        ? error.message
        : "Requisição inválida.";
  if (status >= 500)
    console.error(
      "[CMS] request failed",
      error instanceof Error ? error.name : "unknown"
    );
  res.set("Cache-Control", "no-store");
  return res.status(status).json({ error: message });
}

function asyncRoute(
  handler: (req: Request, res: Response) => Promise<unknown>
) {
  return (req: Request, res: Response) => {
    void handler(req, res).catch(error => jsonError(res, error));
  };
}

async function authenticateCms(req: Request): Promise<CmsAuth | null> {
  let user: AuthenticatedUser;
  try {
    user = await sdk.authenticateRequest(req);
  } catch {
    return null;
  }
  if (!user || !Number.isSafeInteger(user.id) || user.id < 1 || !user.openId)
    return null;
  const grant = await getCmsGrantByUserId(user.id);
  const isOwner = Boolean(ENV.ownerOpenId && user.openId === ENV.ownerOpenId);
  return { user, role: isOwner ? "admin" : (grant?.role ?? null), isOwner };
}

async function requireCmsRole(
  req: Request,
  roles: CmsRole[]
): Promise<CmsAuth> {
  const auth = await authenticateCms(req);
  if (!auth || !auth.role || !roles.includes(auth.role)) {
    throw new CmsHttpError(403, "Acesso CMS não autorizado.");
  }
  return auth;
}

function cmsUserFromRow(
  row: {
    id: number;
    openId: string;
    name: string | null;
    email: string | null;
    grantRole: CmsRole | null;
  },
  ownerOpenId: string
): CmsUser {
  const isOwner = Boolean(ownerOpenId && row.openId === ownerOpenId);
  return {
    id: row.id,
    openId: row.openId,
    name: row.name,
    email: row.email,
    role: isOwner ? "admin" : row.grantRole,
    isOwner,
  };
}

function assertDocumentId(value: string): number {
  if (!/^\d+$/.test(value)) throw new CmsHttpError(400, "id inválido.");
  const id = Number(value);
  if (!Number.isSafeInteger(id) || id < 1)
    throw new CmsHttpError(400, "id inválido.");
  return id;
}

function affectedRows(result: unknown): number {
  const candidate = result as {
    affectedRows?: number;
    [key: number]: { affectedRows?: number } | undefined;
  };
  return Number(candidate?.affectedRows ?? candidate?.[0]?.affectedRows ?? 0);
}

async function writeAudit(
  db: Awaited<ReturnType<typeof requireCmsDb>>,
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

async function assertUploadedPdf(
  db: Awaited<ReturnType<typeof requireCmsDb>>,
  downloadUrl: string
): Promise<void> {
  const rows = await db
    .select({ id: cmsMedia.id })
    .from(cmsMedia)
    .where(
      and(
        eq(cmsMedia.url, downloadUrl),
        eq(cmsMedia.mime, "application/pdf"),
        eq(cmsMedia.hidden, 0)
      )
    )
    .limit(1);
  if (!rows.length)
    throw new CmsValidationError(
      "Material publicado precisa apontar para um PDF enviado pela biblioteca."
    );
}

async function createDocument(
  req: Request,
  res: Response,
  auth: CmsAuth
): Promise<unknown> {
  const parsed = parseCmsSaveRequest(req.body);
  assertPayloadSize(parsed.payload);
  assertApprovedLocks(parsed.key, parsed.payload);
  assertStructuredKind(parsed.kind, parsed.payload, parsed.slug);
  const db = await requireCmsDb();
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
  if (existing.length)
    throw new CmsConflictError("Já existe um documento com essa key e locale.");
  if (["page", "landing"].includes(parsed.kind)) {
    const origin = await db
      .select()
      .from(cmsDocuments)
      .where(eq(cmsDocuments.key, parsed.key))
      .limit(1);
    if (!origin.length || origin[0].kind !== parsed.kind)
      throw new CmsValidationError(
        "Somente variantes das páginas existentes podem ser criadas."
      );
  }
  const serialized = JSON.stringify(parsed.payload);
  const result = await db.insert(cmsDocuments).values({
    key: parsed.key,
    kind: parsed.kind,
    locale: parsed.locale,
    slug: parsed.slug,
    status: "draft",
    draftPayload: serialized,
    publishedPayload: null,
    revision: 1,
  });
  const insertId = Number(
    (result as any).insertId ?? (result as any)[0]?.insertId ?? 0
  );
  const rows = insertId
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
  if (!rows.length) throw new Error("CMS document insert could not be read");
  await writeAudit(db, rows[0].id, auth.user.openId, "save", 1, {
    draft: parsed.payload,
    published: null,
  });
  return toCmsDocument(rows[0]);
}

async function updateDocument(
  req: Request,
  res: Response,
  auth: CmsAuth,
  id: number
): Promise<unknown> {
  const parsed = parseCmsSaveRequest({ ...req.body, id: req.body?.id ?? id });
  if (parsed.id !== id)
    throw new CmsValidationError("id da URL e do corpo não coincidem.");
  assertPayloadSize(parsed.payload);
  assertApprovedLocks(parsed.key, parsed.payload);
  assertStructuredKind(parsed.kind, parsed.payload, parsed.slug);
  const db = await requireCmsDb();
  const currentRows = await db
    .select()
    .from(cmsDocuments)
    .where(eq(cmsDocuments.id, id))
    .limit(1);
  if (!currentRows.length)
    throw new CmsHttpError(404, "Documento não encontrado.");
  const current = currentRows[0];
  if (parsed.revision !== current.revision) throw new CmsConflictError();
  if (
    parsed.key !== current.key ||
    parsed.locale !== current.locale ||
    parsed.slug !== current.slug ||
    parsed.kind !== current.kind
  ) {
    throw new CmsValidationError(
      "key, tipo, locale e slug não podem ser alterados após a criação do documento."
    );
  }
  const duplicate = await db
    .select({ id: cmsDocuments.id })
    .from(cmsDocuments)
    .where(
      and(
        eq(cmsDocuments.key, parsed.key),
        eq(cmsDocuments.locale, parsed.locale)
      )
    )
    .limit(1);
  if (duplicate.length && duplicate[0].id !== id)
    throw new CmsConflictError("Já existe um documento com essa key e locale.");
  const nextRevision = current.revision + 1;
  const serialized = JSON.stringify(parsed.payload);
  const result = await db
    .update(cmsDocuments)
    .set({
      key: parsed.key,
      kind: parsed.kind,
      locale: parsed.locale,
      slug: parsed.slug,
      status: "draft",
      draftPayload: serialized,
      revision: nextRevision,
      updatedAt: new Date(),
    })
    .where(
      and(eq(cmsDocuments.id, id), eq(cmsDocuments.revision, current.revision))
    );
  if (affectedRows(result) === 0) throw new CmsConflictError();
  const updatedRows = await db
    .select()
    .from(cmsDocuments)
    .where(eq(cmsDocuments.id, id))
    .limit(1);
  if (!updatedRows.length)
    throw new Error("CMS document update could not be read");
  await writeAudit(db, id, auth.user.openId, "save", nextRevision, {
    draft: parsed.payload,
    published: JSON.parse(current.publishedPayload ?? "null"),
  });
  return toCmsDocument(updatedRows[0]);
}

function magicMatches(data: Buffer, mime: string): boolean {
  if (mime === "image/jpeg")
    return (
      data.length >= 3 &&
      data[0] === 0xff &&
      data[1] === 0xd8 &&
      data[2] === 0xff
    );
  if (mime === "image/png")
    return data
      .subarray(0, 8)
      .equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  if (mime === "image/webp")
    return (
      data.length >= 12 &&
      data.subarray(0, 4).toString("ascii") === "RIFF" &&
      data.subarray(8, 12).toString("ascii") === "WEBP"
    );
  if (mime === "application/pdf")
    return data.subarray(0, 5).toString("ascii") === "%PDF-";
  return false;
}

async function saveMedia(
  req: Request,
  res: Response,
  auth: CmsAuth
): Promise<unknown> {
  const parsed = parseMediaUpload(req.body);
  const bytes = Buffer.from(parsed.base64, "base64");
  const maxBytes =
    parsed.mime === "application/pdf" ? 15 * 1024 * 1024 : 5 * 1024 * 1024;
  if (
    bytes.length === 0 ||
    bytes.length > maxBytes ||
    !magicMatches(bytes, parsed.mime)
  ) {
    throw new CmsValidationError(
      "Arquivo vazio, grande demais ou com assinatura incompatível."
    );
  }
  const safeName = parsed.name.replace(/[^A-Za-z0-9._-]/g, "_");
  let stored: { key: string; url: string };
  try {
    stored = await storagePut(
      `cms/${randomUUID()}-${safeName}`,
      bytes,
      parsed.mime
    );
  } catch {
    throw new CmsHttpError(502, "Não foi possível armazenar a mídia.");
  }
  const db = await requireCmsDb();
  const result = await db.insert(cmsMedia).values({
    key: stored.key,
    url: stored.url,
    name: parsed.name,
    mime: parsed.mime,
    size: bytes.length,
    alt: parsed.alt,
    title: parsed.title,
    hidden: 0,
  });
  const insertId = Number(
    (result as any).insertId ?? (result as any)[0]?.insertId ?? 0
  );
  const rows = insertId
    ? await db.select().from(cmsMedia).where(eq(cmsMedia.id, insertId)).limit(1)
    : await db
        .select()
        .from(cmsMedia)
        .where(eq(cmsMedia.key, stored.key))
        .limit(1);
  if (!rows.length) throw new Error("CMS media insert could not be read");
  await writeAudit(
    db,
    null,
    auth.user.openId,
    "media_upload",
    null,
    undefined,
    stored.key
  );
  return toCmsMedia(rows[0]);
}

export function registerCmsRoutes(app: Express): void {
  const router = Router();

  router.get(
    "/me",
    asyncRoute(async (req, res) => {
      const auth = await authenticateCms(req);
      if (!auth) return jsonOk(res, null);
      return jsonOk(res, {
        id: auth.user.id,
        openId: auth.user.openId,
        name: auth.user.name ?? null,
        email: auth.user.email ?? null,
        role: auth.role,
        isOwner: auth.isOwner,
      } satisfies CmsUser);
    })
  );

  router.get(
    "/public",
    asyncRoute(async (_req, res) => {
      const documents = (await getPublishedDocuments()).filter(document => {
        try {
          assertPublishable(document.kind, document.payload);
          return true;
        } catch {
          return false;
        }
      });
      return jsonOk(res, { documents });
    })
  );

  router.get(
    "/documents",
    asyncRoute(async (req, res) => {
      await requireCmsRole(req, ["admin", "editor"]);
      return jsonOk(res, await listCmsDocuments());
    })
  );

  router.get(
    "/documents/:id",
    asyncRoute(async (req, res) => {
      await requireCmsRole(req, ["admin", "editor"]);
      const document = await getCmsDocument(assertDocumentId(req.params.id));
      if (!document) throw new CmsHttpError(404, "Documento não encontrado.");
      return jsonOk(res, document);
    })
  );

  router.post(
    "/documents",
    asyncRoute(async (req, res) => {
      assertCmsCsrf(req);
      const auth = await requireCmsRole(req, ["admin", "editor"]);
      const id =
        req.body && typeof req.body.id === "number" ? req.body.id : undefined;
      return jsonOk(
        res,
        id
          ? await updateDocument(req, res, auth, assertDocumentId(String(id)))
          : await createDocument(req, res, auth),
        200
      );
    })
  );

  router.post(
    "/documents/:id/action",
    asyncRoute(async (req, res) => {
      assertCmsCsrf(req);
      const auth = await requireCmsRole(req, ["admin", "editor"]);
      const id = assertDocumentId(req.params.id);
      const action = parseCmsActionRequest(req.body);
      if (
        ["publish", "unpublish", "archive"].includes(action.action) &&
        auth.role !== "admin"
      ) {
        throw new CmsHttpError(
          403,
          "Somente administradores podem publicar, despublicar ou arquivar."
        );
      }
      const db = await requireCmsDb();
      const rows = await db
        .select()
        .from(cmsDocuments)
        .where(eq(cmsDocuments.id, id))
        .limit(1);
      if (!rows.length)
        throw new CmsHttpError(404, "Documento não encontrado.");
      const current = rows[0];
      if (current.revision !== action.revision) throw new CmsConflictError();
      const draft = JSON.parse(
        current.draftPayload
      ) as import("@shared/cms").CmsPayload;
      assertApprovedLocks(current.key, draft);
      if (action.action === "publish") {
        assertPublishable(current.kind as import("@shared/cms").CmsKind, draft);
        assertStructuredKind(
          current.kind as import("@shared/cms").CmsKind,
          draft,
          current.slug
        );
        if (current.kind === "material")
          await assertUploadedPdf(db, draft.downloadUrl);
      }
      const nextRevision = current.revision + 1;
      const nextStatus =
        action.action === "review"
          ? "review"
          : action.action === "draft"
            ? "draft"
            : action.action === "publish"
              ? "published"
              : action.action === "archive"
                ? "archived"
                : "draft";
      const nextPublished =
        action.action === "publish"
          ? current.draftPayload
          : action.action === "unpublish"
            ? null
            : current.publishedPayload;
      const result = await db
        .update(cmsDocuments)
        .set({
          status: nextStatus,
          publishedPayload: nextPublished,
          revision: nextRevision,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(cmsDocuments.id, id),
            eq(cmsDocuments.revision, current.revision)
          )
        );
      if (affectedRows(result) === 0) throw new CmsConflictError();
      const updatedRows = await db
        .select()
        .from(cmsDocuments)
        .where(eq(cmsDocuments.id, id))
        .limit(1);
      if (!updatedRows.length)
        throw new Error("CMS action update could not be read");
      await writeAudit(db, id, auth.user.openId, action.action, nextRevision, {
        draft,
        published: JSON.parse(nextPublished ?? "null"),
        status: nextStatus,
      });
      return jsonOk(res, toCmsDocument(updatedRows[0]));
    })
  );

  router.get(
    "/audit",
    asyncRoute(async (req, res) => {
      await requireCmsRole(req, ["admin", "editor"]);
      return jsonOk(res, await listCmsAudit());
    })
  );

  router.get(
    "/users",
    asyncRoute(async (req, res) => {
      const auth = await requireCmsRole(req, ["admin"]);
      void auth;
      const rows = await listCmsUsers();
      return jsonOk(
        res,
        rows.map(row => cmsUserFromRow(row, ENV.ownerOpenId))
      );
    })
  );

  router.post(
    "/users/access",
    asyncRoute(async (req, res) => {
      assertCmsCsrf(req);
      const auth = await requireCmsRole(req, ["admin"]);
      const parsed = parseAccessRequest(req.body);
      const target = await getUserByOpenIdForCms(parsed.openId);
      if (!target)
        throw new CmsHttpError(
          404,
          "A identidade precisa ter feito login antes de receber acesso CMS."
        );
      const ownerTarget = Boolean(
        ENV.ownerOpenId && parsed.openId === ENV.ownerOpenId
      );
      if (ownerTarget && parsed.role !== "admin")
        throw new CmsHttpError(
          403,
          "O proprietário configurado não pode perder acesso de administrador."
        );
      if (
        parsed.openId === auth.user.openId &&
        auth.role === "admin" &&
        parsed.role !== "admin"
      ) {
        const administrators = new Set(await listCmsAdminOpenIds());
        if (ENV.ownerOpenId) administrators.add(ENV.ownerOpenId);
        if (administrators.size <= 1)
          throw new CmsHttpError(
            403,
            "O último administrador não pode remover o próprio acesso."
          );
      }
      const db = await requireCmsDb();
      if (parsed.role === null) {
        await db.delete(cmsGrants).where(eq(cmsGrants.userId, target.id));
      } else {
        await db
          .insert(cmsGrants)
          .values({ userId: target.id, role: parsed.role })
          .onDuplicateKeyUpdate({
            set: { role: parsed.role, updatedAt: new Date() },
          });
      }
      await writeAudit(
        db,
        null,
        auth.user.openId,
        parsed.role ? `grant_${parsed.role}` : "revoke_access",
        null,
        undefined,
        parsed.openId
      );
      const grantRows = await db
        .select()
        .from(cmsGrants)
        .where(eq(cmsGrants.userId, target.id))
        .limit(1);
      return jsonOk(res, {
        id: target.id,
        openId: target.openId,
        name: target.name,
        email: target.email,
        role: ownerTarget ? "admin" : (grantRows[0]?.role ?? null),
        isOwner: ownerTarget,
      } satisfies CmsUser);
    })
  );

  router.get(
    "/media",
    asyncRoute(async (req, res) => {
      const auth = await requireCmsRole(req, ["admin", "editor"]);
      const includeHidden =
        req.query.includeHidden === "1" && auth.role === "admin";
      return jsonOk(res, await listCmsMedia(includeHidden));
    })
  );

  router.post(
    "/media/upload",
    asyncRoute(async (req, res) => {
      assertCmsCsrf(req);
      const auth = await requireCmsRole(req, ["admin", "editor"]);
      return jsonOk(res, await saveMedia(req, res, auth));
    })
  );

  router.post(
    "/media/:id",
    asyncRoute(async (req, res) => {
      assertCmsCsrf(req);
      const auth = await requireCmsRole(req, ["admin", "editor"]);
      const id = assertDocumentId(req.params.id);
      const parsed = parseMediaUpdate(req.body);
      const db = await requireCmsDb();
      const current = await db
        .select()
        .from(cmsMedia)
        .where(eq(cmsMedia.id, id))
        .limit(1);
      if (!current.length) throw new CmsHttpError(404, "Mídia não encontrada.");
      const result = await db
        .update(cmsMedia)
        .set({
          ...(parsed.alt === undefined ? {} : { alt: parsed.alt }),
          ...(parsed.title === undefined ? {} : { title: parsed.title }),
          ...(parsed.hidden === undefined
            ? {}
            : { hidden: parsed.hidden ? 1 : 0 }),
          updatedAt: new Date(),
        })
        .where(eq(cmsMedia.id, id));
      if (affectedRows(result) === 0)
        throw new CmsConflictError("A mídia não foi alterada.");
      const updated = await getCmsMedia(id);
      if (!updated) throw new Error("CMS media update could not be read");
      await writeAudit(
        db,
        null,
        auth.user.openId,
        "media_update",
        null,
        undefined,
        String(id)
      );
      return jsonOk(res, updated);
    })
  );

  app.use("/api/cms", router);
}

export { authenticateCms, requireCmsRole };
