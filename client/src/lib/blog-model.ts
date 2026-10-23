import type { BlogPreview } from "@shared/blog";
import type { CmsKind, PublishedDocument } from "@shared/cms";

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

/**
 * Public UI model. Review entries intentionally contain metadata only; they
 * never carry blocks, references, or a draft URL.
 */
export type BlogEntry = PublishedBlogEntry | ReviewBlogEntry;

export function isPublishedBlogDocument(
  document: PublishedDocument
): document is PublishedDocument & { kind: BlogContentKind } {
  return (
    document.locale === "pt-BR" &&
    BLOG_CONTENT_KINDS.includes(document.kind as BlogContentKind) &&
    Boolean(document.slug)
  );
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
  documents: PublishedDocument[]
): BlogEntry[] {
  const publishedBySlug = new Map<string, PublishedBlogEntry>();
  const publishedDocuments = documents.filter(isPublishedBlogDocument);
  for (const document of publishedDocuments) {
    if (!publishedBySlug.has(document.slug)) {
      publishedBySlug.set(
        document.slug,
        publishedDocumentToBlogEntry(document)
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

export function formatBlogDate(value: string): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
