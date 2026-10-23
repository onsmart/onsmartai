import { z } from "zod";
export const CMS_KINDS = [
  "page",
  "landing",
  "article",
  "news",
  "case",
  "video",
  "material",
  "banner",
] as const;
export const CMS_LOCALES = ["pt-BR", "en", "es"] as const;
export const CMS_CATEGORIES = [
  "Blog",
  "Notícias",
  "Onsmart na mídia",
  "Cases",
  "Vídeos",
  "E-books",
  "Playbooks",
  "Materiais gratuitos",
] as const;
export const CmsKindSchema = z.enum(CMS_KINDS);
export const CmsLocaleSchema = z.enum(CMS_LOCALES);
export const CmsBlockSchema = z.object({
  type: z.enum(["paragraph", "heading", "list", "quote", "link"]),
  text: z.string().max(12000).default(""),
  items: z.array(z.string().max(2000)).max(50).default([]),
  href: z.string().max(2048).default(""),
});
export const CmsPayloadSchema = z.object({
  title: z.string().max(220),
  summary: z.string().max(2000).default(""),
  author: z.string().max(150).default(""),
  publishedAt: z.string().max(40).default(""),
  seoTitle: z.string().max(120).default(""),
  seoDescription: z.string().max(300).default(""),
  imageUrl: z.string().max(2048).default(""),
  imageAlt: z.string().max(300).default(""),
  category: z.string().max(80).default("Blog"),
  relatedSlugs: z.array(z.string().max(180)).max(10).default([]),
  blocks: z.array(CmsBlockSchema).max(100).default([]),
  fields: z.record(z.string(), z.unknown()).default({}),
  bannerTargets: z.array(z.string().max(200)).max(30).default([]),
  downloadUrl: z.string().max(2048).default(""),
  sourceUrl: z.string().max(2048).default(""),
  validationNote: z.string().max(2000).default(""),
});
export type CmsPayload = z.infer<typeof CmsPayloadSchema>;
export type CmsBlock = z.infer<typeof CmsBlockSchema>;
export type CmsKind = (typeof CMS_KINDS)[number];
export type CmsLocale = (typeof CMS_LOCALES)[number];
export type CmsRole = "admin" | "editor";
export type CmsStatus = "draft" | "review" | "published" | "archived";
export type CmsUser = {
  id: number;
  openId: string;
  name: string | null;
  email: string | null;
  role: CmsRole | null;
  isOwner: boolean;
};
export type CmsDocument = {
  id: number;
  key: string;
  kind: CmsKind;
  locale: CmsLocale;
  slug: string;
  title: string;
  status: CmsStatus;
  draft: CmsPayload;
  published: CmsPayload | null;
  revision: number;
  updatedAt: string;
  hasPublished: boolean;
};
export type PublishedDocument = {
  id: number;
  key: string;
  kind: CmsKind;
  locale: CmsLocale;
  slug: string;
  payload: CmsPayload;
};
export type CmsMedia = {
  id: number;
  key: string;
  url: string;
  name: string;
  mime: string;
  size: number;
  alt: string;
  title: string;
  createdAt: string;
  hidden: boolean;
};
export type CmsAudit = {
  id: number;
  documentId: number | null;
  action: string;
  actor: string;
  createdAt: string;
  note: string;
};
export type CmsSaveRequest = {
  id?: number;
  revision?: number;
  key: string;
  kind: CmsKind;
  locale: CmsLocale;
  slug: string;
  payload: CmsPayload;
};
export type CmsActionRequest = {
  revision: number;
  action: "review" | "draft" | "publish" | "unpublish" | "archive";
};
export const kindLabels: Record<CmsKind, string> = {
  page: "Página institucional",
  landing: "Landing page",
  article: "Artigo",
  news: "Notícia",
  case: "Case",
  video: "Vídeo",
  material: "Material gratuito",
  banner: "Banner",
};
export function safeCmsUrl(value: string): string {
  if (!value) return "";
  if (
    value.startsWith("/") &&
    !value.startsWith("//") &&
    !/[\\\u0000-\u0020]/.test(value)
  )
    return value;
  try {
    const url = new URL(value);
    return ["https:", "http:", "mailto:", "tel:"].includes(url.protocol) &&
      !url.username &&
      !url.password
      ? value
      : "";
  } catch {
    return "";
  }
}
export const cmsEmptyPayload = (): CmsPayload => ({
  title: "",
  summary: "",
  author: "",
  publishedAt: "",
  seoTitle: "",
  seoDescription: "",
  imageUrl: "",
  imageAlt: "",
  category: "Blog",
  relatedSlugs: [],
  blocks: [],
  fields: {},
  bannerTargets: [],
  downloadUrl: "",
  sourceUrl: "",
  validationNote: "",
});
