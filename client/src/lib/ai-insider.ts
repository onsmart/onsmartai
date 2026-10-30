import feed from "@/data/ai-insider-brazil.json";
import type { ExternalBlogEntry } from "@/lib/blog-model";

export const AI_INSIDER_NEWSLETTER_URL = feed.newsletterUrl;
export const AI_INSIDER_SERIES = feed.series;

export function loadAiInsiderBlogEntries(): ExternalBlogEntry[] {
  return feed.editions.map(edition => ({
    status: "external",
    slug: edition.slug,
    title: edition.title,
    summary: edition.summary,
    author: feed.author,
    topic: feed.topic,
    category: feed.category,
    imageUrl: feed.imageUrl,
    imageAlt: feed.imageAlt,
    publishedAt: edition.publishedAt,
    sourceUrl: edition.sourceUrl,
  }));
}
