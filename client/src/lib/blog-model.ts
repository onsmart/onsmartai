import type { BlogPreview } from "@shared/blog";
import type { CmsKind, PublishedDocument } from "@shared/cms";
import type { SiteLocale } from "@shared/locale";

export const BLOG_CONTENT_KINDS = [
  "article",
  "news",
  "case",
  "video",
  "material",
] as const satisfies readonly CmsKind[];

export type BlogContentKind = (typeof BLOG_CONTENT_KINDS)[number];

export type BlogEntryCommon = {
  slug: string;
  title: string;
  summary: string;
  author: string;
  topic: string;
  category: string;
  imageUrl: string;
  imageAlt: string;
};

export type PublishedBlogEntry = BlogEntryCommon & {
  status: "published";
  kind: BlogContentKind;
  publishedAt: string;
  sourceUrl: string;
  document: PublishedDocument;
};

export type ReviewBlogEntry = BlogEntryCommon & {
  status: "review" | "approved";
  preview: BlogPreview;
};

export type ExternalBlogEntry = BlogEntryCommon & {
  status: "external";
  publishedAt: string;
  sourceUrl: string;
};

/**
 * Public UI model. Review entries intentionally contain metadata only; they
 * never carry blocks, references, or a draft URL.
 */
export type BlogEntry = PublishedBlogEntry | ReviewBlogEntry | ExternalBlogEntry;

function isBlogKind(document: PublishedDocument): boolean {
  return (
    BLOG_CONTENT_KINDS.includes(document.kind as BlogContentKind) &&
    Boolean(document.slug)
  );
}

export function isPublishedBlogDocument(
  document: PublishedDocument,
  locale: SiteLocale = "pt-BR"
): document is PublishedDocument & { kind: BlogContentKind } {
  if (!isBlogKind(document)) return false;
  if (document.locale === locale) return true;
  return locale !== "pt-BR" && document.locale === "pt-BR";
}

export function pickBlogDocument(
  documents: PublishedDocument[],
  slug: string,
  locale: SiteLocale
): (PublishedDocument & { kind: BlogContentKind }) | undefined {
  const localized = documents.find(
    doc =>
      doc.slug === slug && doc.locale === locale && isBlogKind(doc)
  );
  if (localized) return localized as PublishedDocument & { kind: BlogContentKind };
  if (locale === "pt-BR") return undefined;
  const fallback = documents.find(
    doc =>
      doc.slug === slug && doc.locale === "pt-BR" && isBlogKind(doc)
  );
  return fallback as (PublishedDocument & { kind: BlogContentKind }) | undefined;
}

export function getBlogFieldString(
  fields: Record<string, unknown>,
  key: string
): string {
  const value = fields[key];
  return typeof value === "string" ? value.trim() : "";
}

export function getPublishedBlogTopic(document: PublishedDocument): string {
  const topic = getBlogFieldString(document.payload.fields, "topic");
  if (topic) return topic;
  const topics = document.payload.fields.topics;
  if (Array.isArray(topics)) {
    const first = topics.find(item => typeof item === "string");
    if (typeof first === "string" && first.trim()) return first.trim();
  }
  return "";
}

export function publishedDocumentToBlogEntry(
  document: PublishedDocument & { kind: BlogContentKind }
): PublishedBlogEntry {
  const payload = document.payload;
  return {
    status: "published",
    kind: document.kind,
    document,
    slug: document.slug,
    title: payload.title,
    summary: payload.summary,
    author: payload.author,
    topic: getPublishedBlogTopic(document),
    category: payload.category || "Blog",
    imageUrl: payload.imageUrl,
    imageAlt: payload.imageAlt,
    publishedAt: payload.publishedAt,
    sourceUrl: payload.sourceUrl,
  };
}

function previewToBlogEntry(preview: BlogPreview): ReviewBlogEntry {
  return {
    status: preview.editorialStatus === "approved" ? "approved" : "review",
    preview,
    slug: preview.slug,
    title: preview.title,
    summary: preview.summary,
    author: preview.author,
    topic: preview.topic,
    category: "Blog",
    imageUrl: preview.imageUrl,
    imageAlt: preview.imageAlt,
  };
}

/**
 * Merge the public page metadata with real published CMS snapshots. A
 * published snapshot wins for the same slug, so a preview is never counted or
 * rendered twice and never links to a private article body.
 */
export function mergeBlogEntries(
  previews: BlogPreview[],
  documents: PublishedDocument[],
  locale: SiteLocale = "pt-BR"
): BlogEntry[] {
  const publishedBySlug = new Map<string, PublishedBlogEntry>();
  const publishedDocuments = documents.filter(doc =>
    isPublishedBlogDocument(doc, locale)
  );
  for (const document of publishedDocuments) {
    const existing = publishedBySlug.get(document.slug);
    if (
      !existing ||
      (document.locale === locale && existing.document.locale !== locale)
    ) {
      publishedBySlug.set(
        document.slug,
        publishedDocumentToBlogEntry(
          document as PublishedDocument & { kind: BlogContentKind }
        )
      );
    }
  }

  const entries: BlogEntry[] = [];
  const seenSlugs = new Set<string>();
  for (const preview of previews) {
    if (seenSlugs.has(preview.slug)) continue;
    seenSlugs.add(preview.slug);
    const published = publishedBySlug.get(preview.slug);
    entries.push(published ?? previewToBlogEntry(preview));
  }

  for (const document of publishedDocuments) {
    if (!seenSlugs.has(document.slug)) {
      seenSlugs.add(document.slug);
      const published = publishedBySlug.get(document.slug);
      if (published) entries.push(published);
    }
  }
  return entries;
}

function blogEntryTimestamp(entry: BlogEntry): number {
  if (entry.status === "published" || entry.status === "external") {
    const time = new Date(entry.publishedAt).getTime();
    return Number.isNaN(time) ? 0 : time;
  }
  return 0;
}

export function sortBlogEntriesByDate(entries: BlogEntry[]): BlogEntry[] {
  return [...entries].sort(
    (left, right) => blogEntryTimestamp(right) - blogEntryTimestamp(left)
  );
}

/** Syndicated editions (e.g. LinkedIn newsletter) take precedence over same slug. */
export function mergeSyndicatedBlogEntries(
  syndicated: ExternalBlogEntry[],
  entries: BlogEntry[]
): BlogEntry[] {
  const syndicatedSlugs = new Set(syndicated.map(entry => entry.slug));
  const rest = entries.filter(entry => !syndicatedSlugs.has(entry.slug));
  return sortBlogEntriesByDate([...syndicated, ...rest]);
}

export function blogEntryHref(entry: BlogEntry): string | null {
  if (entry.status === "external") return entry.sourceUrl;
  if (entry.status === "published") return `/conteudo/${entry.slug}`;
  return null;
}

export function blogEntryOpensInNewTab(entry: BlogEntry): boolean {
  return entry.status === "external";
}

export function formatBlogDate(
  value: string,
  locale: SiteLocale = "pt-BR"
): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const intlLocale =
    locale === "pt-BR" ? "pt-BR" : locale === "es" ? "es" : "en-US";
  return date.toLocaleDateString(intlLocale, {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
