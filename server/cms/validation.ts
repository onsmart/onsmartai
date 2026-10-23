import type { Request } from "express";
import { z } from "zod";
import {
  CmsActionRequest,
  CmsKind,
  CmsLocale,
  CmsPayload,
  CmsPayloadSchema,
  CmsRole,
  CMS_KINDS,
  CMS_LOCALES,
  safeCmsUrl,
} from "@shared/cms";

export class CmsValidationError extends Error {
  readonly status = 400;

  constructor(message: string) {
    super(message);
    this.name = "CmsValidationError";
  }
}

export class CmsConflictError extends Error {
  readonly status = 409;

  constructor(
    message = "A versão do documento mudou; recarregue e tente novamente."
  ) {
    super(message);
    this.name = "CmsConflictError";
  }
}

export class CmsCsrfError extends Error {
  readonly status = 403;

  constructor(message = "Origem não confiável.") {
    super(message);
    this.name = "CmsCsrfError";
  }
}

export const APPROVED_HOME_TITLE =
  "IA corporativa sem mistério: entenda, implante na sua empresa e veja o valor na operação.";
export const APPROVED_HOME_SUBTITLE =
  "Educação, consultoria e o Ecossistema SON.IA para a sua empresa adotar IA de forma simples, confiável e governável.";
export const APPROVED_MISSION =
  "Tornar a IA corporativa simples de adotar, confiável para operar e governável para escalar.";

const CMS_SAVE_KEYS = new Set([
  "id",
  "revision",
  "key",
  "kind",
  "locale",
  "slug",
  "payload",
]);
const CMS_PAYLOAD_KEYS = new Set([
  "title",
  "summary",
  "author",
  "publishedAt",
  "seoTitle",
  "seoDescription",
  "imageUrl",
  "imageAlt",
  "category",
  "relatedSlugs",
  "blocks",
  "fields",
  "bannerTargets",
  "downloadUrl",
  "sourceUrl",
  "validationNote",
]);
const CMS_BLOCK_KEYS = new Set(["type", "text", "items", "href"]);
const ACTIONS = new Set<CmsActionRequest["action"]>([
  "review",
  "draft",
  "publish",
  "unpublish",
  "archive",
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function rejectUnknownKeys(
  value: Record<string, unknown>,
  allowed: Set<string>,
  label: string
) {
  for (const key of Object.keys(value)) {
    if (!allowed.has(key))
      throw new CmsValidationError(`${label} contém um campo não permitido.`);
  }
}

function ensureString(
  value: unknown,
  label: string,
  max: number,
  required = true
): string {
  if (typeof value !== "string")
    throw new CmsValidationError(`${label} inválido.`);
  if (required && value.trim().length === 0)
    throw new CmsValidationError(`${label} é obrigatório.`);
  if (value.length > max)
    throw new CmsValidationError(`${label} excede o limite permitido.`);
  return value;
}

function ensureSafeJson(
  value: unknown,
  path: string,
  depth = 0,
  keyName = ""
): void {
  if (depth > 12)
    throw new CmsValidationError(
      "Conteúdo estruturado excede a profundidade permitida."
    );
  if (
    value === null ||
    typeof value === "boolean" ||
    typeof value === "number"
  ) {
    if (typeof value === "number" && !Number.isFinite(value)) {
      throw new CmsValidationError(`${path} contém um número inválido.`);
    }
    return;
  }
  if (typeof value === "string") {
    if (value.length > 12000)
      throw new CmsValidationError(`${path} excede o limite permitido.`);
    if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value)) {
      throw new CmsValidationError(`${path} contém caracteres de controle.`);
    }
    if (/<\/?[a-z][^>]*>/i.test(value)) {
      throw new CmsValidationError(`${path} não aceita HTML arbitrário.`);
    }
    if (/^javascript\s*:/i.test(value.trim())) {
      throw new CmsValidationError(`${path} contém uma URL insegura.`);
    }
    if (
      /(?:url|href|src)$/i.test(keyName) ||
      /^(?:source|download|media)$/i.test(keyName)
    ) {
      if (value && !safeCmsUrl(value)) {
        throw new CmsValidationError(`${path} contém uma URL insegura.`);
      }
    }
    return;
  }
  if (Array.isArray(value)) {
    if (value.length > 200)
      throw new CmsValidationError(`${path} contém itens demais.`);
    value.forEach((item, index) =>
      ensureSafeJson(item, `${path}[${index}]`, depth + 1, keyName)
    );
    return;
  }
  if (isRecord(value)) {
    if (Object.keys(value).length > 200)
      throw new CmsValidationError(`${path} contém campos demais.`);
    for (const [key, child] of Object.entries(value)) {
      if (key === "__proto__" || key === "constructor" || key === "prototype") {
        throw new CmsValidationError(
          "Conteúdo estruturado contém uma chave reservada."
        );
      }
      ensureSafeJson(child, `${path}.${key}`, depth + 1, key);
    }
    return;
  }
  throw new CmsValidationError(`${path} não é JSON válido.`);
}

function parsePayload(value: unknown): CmsPayload {
  if (!isRecord(value)) throw new CmsValidationError("payload inválido.");
  rejectUnknownKeys(value, CMS_PAYLOAD_KEYS, "payload");
  const parsed = CmsPayloadSchema.safeParse(value);
  if (!parsed.success) throw new CmsValidationError("payload inválido.");
  const payload = parsed.data as CmsPayload;
  for (const block of payload.blocks) {
    if (isRecord(block)) rejectUnknownKeys(block, CMS_BLOCK_KEYS, "block");
  }
  ensureSafeJson(payload, "payload");
  // URL fields with an empty default are valid; nonempty values are checked recursively above.
  for (const field of ["imageUrl", "downloadUrl", "sourceUrl"] as const) {
    if (payload[field] && !safeCmsUrl(payload[field])) {
      throw new CmsValidationError(`${field} contém uma URL insegura.`);
    }
  }
  return payload;
}

function parseEnum<T extends string>(
  value: unknown,
  values: readonly T[],
  label: string
): T {
  if (typeof value !== "string" || !values.includes(value as T)) {
    throw new CmsValidationError(`${label} inválido.`);
  }
  return value as T;
}

function parseIdentifier(value: unknown, label: string, max: number): string {
  const result = ensureString(value, label, max);
  const pattern = /^(?:\/$|\/?[\p{L}\p{N}][\p{L}\p{N}._~:/-]*)$/u;
  if (!pattern.test(result) || result.includes("//")) {
    throw new CmsValidationError(`${label} inválido.`);
  }
  return result;
}

export type ParsedCmsSave = {
  id?: number;
  revision?: number;
  key: string;
  kind: CmsKind;
  locale: CmsLocale;
  slug: string;
  payload: CmsPayload;
};

export function parseCmsSaveRequest(input: unknown): ParsedCmsSave {
  if (!isRecord(input))
    throw new CmsValidationError("Corpo da requisição inválido.");
  rejectUnknownKeys(input, CMS_SAVE_KEYS, "requisição");
  let id: number | undefined;
  let revision: number | undefined;
  if (input.id !== undefined) {
    if (!Number.isSafeInteger(input.id) || (input.id as number) < 1) {
      throw new CmsValidationError("id inválido.");
    }
    id = input.id as number;
  }
  if (input.revision !== undefined) {
    if (
      !Number.isSafeInteger(input.revision) ||
      (input.revision as number) < 1
    ) {
      throw new CmsValidationError("revision inválida.");
    }
    revision = input.revision as number;
  }
  if (id !== undefined && revision === undefined) {
    throw new CmsValidationError(
      "revision é obrigatória ao atualizar um documento."
    );
  }
  if (id === undefined && revision !== undefined) {
    throw new CmsValidationError("revision só pode ser enviada com id.");
  }
  return {
    id,
    revision,
    key: parseIdentifier(input.key, "key", 180),
    kind: parseEnum(input.kind, CMS_KINDS, "kind"),
    locale: parseEnum(input.locale, CMS_LOCALES, "locale"),
    slug: parseIdentifier(input.slug, "slug", 220),
    payload: parsePayload(input.payload),
  };
}

export function parseCmsActionRequest(input: unknown): CmsActionRequest {
  if (!isRecord(input))
    throw new CmsValidationError("Corpo da requisição inválido.");
  rejectUnknownKeys(input, new Set(["revision", "action"]), "requisição");
  if (!Number.isSafeInteger(input.revision) || (input.revision as number) < 1) {
    throw new CmsValidationError("revision inválida.");
  }
  if (
    typeof input.action !== "string" ||
    !ACTIONS.has(input.action as CmsActionRequest["action"])
  ) {
    throw new CmsValidationError("action inválida.");
  }
  return {
    revision: input.revision as number,
    action: input.action as CmsActionRequest["action"],
  };
}

export type ParsedAccess = { openId: string; role: CmsRole | null };

export function parseAccessRequest(input: unknown): ParsedAccess {
  if (!isRecord(input))
    throw new CmsValidationError("Corpo da requisição inválido.");
  rejectUnknownKeys(input, new Set(["openId", "role"]), "requisição");
  const openId = ensureString(input.openId, "openId", 128);
  if (/\s/.test(openId)) throw new CmsValidationError("openId inválido.");
  if (
    input.role !== null &&
    input.role !== "admin" &&
    input.role !== "editor"
  ) {
    throw new CmsValidationError("role inválido.");
  }
  return { openId, role: input.role as CmsRole | null };
}

export type ParsedMediaUpload = {
  name: string;
  mime: "image/jpeg" | "image/png" | "image/webp" | "application/pdf";
  base64: string;
  alt: string;
  title: string;
};

export function parseMediaUpload(input: unknown): ParsedMediaUpload {
  if (!isRecord(input))
    throw new CmsValidationError("Corpo da requisição inválido.");
  rejectUnknownKeys(
    input,
    new Set(["name", "mime", "base64", "alt", "title"]),
    "requisição"
  );
  const name = ensureString(input.name, "name", 255);
  if (/[\\/\u0000-\u001f]/.test(name) || name.startsWith(".")) {
    throw new CmsValidationError("name inválido.");
  }
  const mime = input.mime;
  const accepted = new Set<ParsedMediaUpload["mime"]>([
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/pdf",
  ]);
  if (
    typeof mime !== "string" ||
    !accepted.has(mime as ParsedMediaUpload["mime"])
  ) {
    throw new CmsValidationError("mime não permitido.");
  }
  const base64 = ensureString(input.base64, "base64", 21_000_000);
  if (
    base64.startsWith("data:") ||
    !/^[A-Za-z0-9+/]*={0,2}$/.test(base64) ||
    base64.length % 4 === 1
  ) {
    throw new CmsValidationError("base64 inválido.");
  }
  const alt =
    input.alt === undefined ? "" : ensureString(input.alt, "alt", 300, false);
  const title =
    input.title === undefined
      ? ""
      : ensureString(input.title, "title", 300, false);
  const ext = name.includes(".")
    ? name.slice(name.lastIndexOf(".") + 1).toLowerCase()
    : "";
  const expectedExt: Record<ParsedMediaUpload["mime"], string[]> = {
    "image/jpeg": ["jpg", "jpeg"],
    "image/png": ["png"],
    "image/webp": ["webp"],
    "application/pdf": ["pdf"],
  };
  if (!expectedExt[mime as ParsedMediaUpload["mime"]].includes(ext)) {
    throw new CmsValidationError("name não corresponde ao MIME informado.");
  }
  return { name, mime: mime as ParsedMediaUpload["mime"], base64, alt, title };
}

export type ParsedMediaUpdate = {
  alt?: string;
  title?: string;
  hidden?: boolean;
};

export function parseMediaUpdate(input: unknown): ParsedMediaUpdate {
  if (!isRecord(input))
    throw new CmsValidationError("Corpo da requisição inválido.");
  rejectUnknownKeys(input, new Set(["alt", "title", "hidden"]), "requisição");
  const result: ParsedMediaUpdate = {};
  if (input.alt !== undefined)
    result.alt = ensureString(input.alt, "alt", 300, false);
  if (input.title !== undefined)
    result.title = ensureString(input.title, "title", 300, false);
  if (input.hidden !== undefined) {
    if (typeof input.hidden !== "boolean")
      throw new CmsValidationError("hidden inválido.");
    result.hidden = input.hidden;
  }
  if (Object.keys(result).length === 0)
    throw new CmsValidationError("Nenhuma alteração informada.");
  return result;
}

function collectNamedStrings(
  value: unknown,
  names: Set<string>,
  result: string[],
  path = ""
): void {
  if (Array.isArray(value)) {
    value.forEach((item, index) =>
      collectNamedStrings(item, names, result, `${path}[${index}]`)
    );
    return;
  }
  if (!isRecord(value)) return;
  for (const [key, child] of Object.entries(value)) {
    const normalized = key.toLowerCase().replace(/[-_]/g, "");
    if (names.has(normalized) && typeof child === "string" && child.trim())
      result.push(child.trim());
    collectNamedStrings(child, names, result, path ? `${path}.${key}` : key);
  }
}

function isHomeKey(key: string): boolean {
  const normalized = key.toLowerCase();
  return (
    normalized === "home" ||
    normalized.includes("home-page") ||
    normalized.includes("home_page") ||
    normalized === "/"
  );
}

function assertMandatoryTextEntries(fields: unknown): void {
  if (!isRecord(fields) || !Array.isArray(fields.texts)) return;
  for (const entry of fields.texts) {
    if (
      !isRecord(entry) ||
      typeof entry.original !== "string" ||
      typeof entry.text !== "string"
    )
      continue;
    const original = entry.original.trim();
    const text = entry.text.trim();
    if (
      (original === "MISSION" || original === APPROVED_MISSION) &&
      text !== APPROVED_MISSION
    ) {
      throw new CmsValidationError(
        "A missão aprovada não pode ser alterada nesta fase."
      );
    }
    if (
      [
        "HERO",
        "HERO_TITLE",
        "HOME_H1",
        "HOME_TITLE",
        APPROVED_HOME_TITLE,
      ].includes(original) &&
      text !== APPROVED_HOME_TITLE
    ) {
      throw new CmsValidationError(
        "O título aprovado da Home não pode ser alterado nesta fase."
      );
    }
    if (
      ["HERO_SUBTITLE", "HOME_SUBTITLE", APPROVED_HOME_SUBTITLE].includes(
        original
      ) &&
      text !== APPROVED_HOME_SUBTITLE
    ) {
      throw new CmsValidationError(
        "O subtítulo aprovado da Home não pode ser alterado nesta fase."
      );
    }
  }
}

/** Keep the already approved homologation copy from being changed accidentally by a CMS save. */
export function assertApprovedLocks(key: string, payload: CmsPayload): void {
  assertMandatoryTextEntries(payload.fields);
  if (isHomeKey(key)) {
    const titles: string[] = [];

    collectNamedStrings(payload.fields, new Set(["herotitle"]), titles);
    if (titles.some(value => value !== APPROVED_HOME_TITLE)) {
      throw new CmsValidationError(
        "O título aprovado da Home não pode ser alterado nesta fase."
      );
    }
    const subtitles: string[] = [];

    collectNamedStrings(
      payload.fields,
      new Set(["herosubtitle", "herodescription"]),
      subtitles
    );
    if (subtitles.some(value => value !== APPROVED_HOME_SUBTITLE)) {
      throw new CmsValidationError(
        "O subtítulo aprovado da Home não pode ser alterado nesta fase."
      );
    }
  }

  const missionValues: string[] = [];
  if (key.toLowerCase().includes("mission")) {
    if (payload.title.trim()) missionValues.push(payload.title.trim());
    if (payload.summary.trim()) missionValues.push(payload.summary.trim());
  }
  collectNamedStrings(
    payload.fields,
    new Set(["mission", "missiontext"]),
    missionValues
  );
  if (missionValues.some(value => value !== APPROVED_MISSION)) {
    throw new CmsValidationError(
      "A missão aprovada não pode ser alterada nesta fase."
    );
  }
}

function hasBody(payload: CmsPayload): boolean {
  return Boolean(
    payload.summary.trim() ||
      payload.blocks.some(
        block => block.text.trim() || block.items.some(item => item.trim())
      )
  );
}

function validDate(value: string): boolean {
  return Boolean(value.trim()) && !Number.isNaN(Date.parse(value));
}

export function assertPublishable(kind: CmsKind, payload: CmsPayload): void {
  if (!payload.title.trim())
    throw new CmsValidationError("Um documento publicado precisa de título.");
  if (["article", "news", "case", "material"].includes(kind)) {
    if (!payload.author.trim())
      throw new CmsValidationError(
        "Conteúdo editorial publicado precisa de autor."
      );
    if (!validDate(payload.publishedAt))
      throw new CmsValidationError(
        "Conteúdo editorial publicado precisa de data válida."
      );
    if (!hasBody(payload))
      throw new CmsValidationError(
        "Conteúdo editorial publicado precisa de corpo."
      );
  }
  if (kind === "video" && !payload.sourceUrl.trim()) {
    throw new CmsValidationError(
      "Vídeo publicado precisa de sourceUrl autorizado."
    );
  }
  if (kind === "material" && !payload.downloadUrl.trim()) {
    throw new CmsValidationError(
      "Material publicado precisa de PDF autorizado."
    );
  }
}

export function assertPayloadSize(
  value: unknown,
  maxBytes = 2 * 1024 * 1024
): void {
  let serialized: string;
  try {
    serialized = JSON.stringify(value);
  } catch {
    throw new CmsValidationError("Conteúdo não é serializável.");
  }
  if (Buffer.byteLength(serialized, "utf8") > maxBytes) {
    throw new CmsValidationError("payload excede o limite de 2 MB.");
  }
}

function expectedRequestOrigin(req: Request): string | null {
  const forwardedProto = req.get("x-forwarded-proto");
  const forwardedHost = req.get("x-forwarded-host");
  if ((forwardedProto && !forwardedHost) || (!forwardedProto && forwardedHost))
    return null;
  const proto = (forwardedProto || req.protocol || "http").trim();
  const host = (forwardedHost || req.get("host") || "").trim();
  if (
    !/^(?:https|http)$/.test(proto) ||
    !host ||
    /[,\s]/.test(host) ||
    !/^[A-Za-z0-9.:[\]-]+$/.test(host)
  )
    return null;
  return `${proto}://${host}`;
}

/** Mutating CMS requests require a custom header and, when sent by a browser, exact same-origin. */
export function assertCmsCsrf(req: Request): void {
  if (req.get("x-cms-request") !== "1") {
    throw new CmsCsrfError("Cabeçalho de requisição CMS ausente.");
  }
  const origin = req.get("origin");
  if (!origin) {
    if (req.get("sec-fetch-site") === "cross-site") throw new CmsCsrfError();
    return;
  }
  if (origin === "null") throw new CmsCsrfError();
  const expected = expectedRequestOrigin(req);
  if (!expected) throw new CmsCsrfError();
  try {
    if (new URL(origin).origin !== new URL(expected).origin)
      throw new CmsCsrfError();
  } catch {
    throw new CmsCsrfError();
  }
}

export function isoDate(value: Date | string | null | undefined): string {
  if (!value) return new Date(0).toISOString();
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime())
    ? new Date(0).toISOString()
    : date.toISOString();
}

export function assertStructuredKind(
  kind: CmsKind,
  payload: CmsPayload,
  slug?: string
): void {
  if (kind !== "landing") return;
  const fields = payload.fields;
  if (slug !== undefined && fields.slug !== slug)
    throw new CmsValidationError(
      "O identificador comercial deve corresponder ao documento."
    );
  for (const key of [
    "slug",
    "eyebrow",
    "heroTitle",
    "lead",
    "contextTitle",
    "context",
    "solutionTitle",
    "solutionText",
    "methodology",
    "cta",
    "interest",
    "metaTitle",
    "metaDescription",
  ]) {
    if (typeof fields[key] !== "string" || !(fields[key] as string).trim())
      throw new CmsValidationError(`Campo comercial obrigatório: ${key}`);
  }
  for (const key of ["audiences", "deliverables", "reviewNotes"]) {
    if (
      !Array.isArray(fields[key]) ||
      !(fields[key] as unknown[]).every(item => typeof item === "string")
    )
      throw new CmsValidationError(`Lista comercial inválida: ${key}`);
  }
  for (const key of ["goals", "flow", "differentiators"]) {
    if (
      !Array.isArray(fields[key]) ||
      !(fields[key] as unknown[]).every(
        item =>
          isRecord(item) &&
          typeof item.title === "string" &&
          typeof item.text === "string"
      )
    )
      throw new CmsValidationError(`Blocos comerciais inválidos: ${key}`);
  }
  if (
    !Array.isArray(fields.faqs) ||
    !fields.faqs.every(
      item =>
        isRecord(item) &&
        typeof item.q === "string" &&
        typeof item.a === "string"
    )
  )
    throw new CmsValidationError("FAQ comercial inválido.");
}
