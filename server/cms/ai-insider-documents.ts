/**
 * AI Insider Brazil — syndicated LinkedIn newsletter as published CMS news docs.
 * Loaded from client data JSON (no @shared) for Vite build + dev CMS merge.
 */
import feed from "../../client/src/data/ai-insider-brazil.json";

export type AiInsiderEdition = {
  slug: string;
  title: string;
  summary: string;
  publishedAt: string;
  sourceUrl: string;
  imageUrl?: string;
  imageAlt?: string;
};

export type AiInsiderFeed = {
  series: string;
  newsletterUrl: string;
  author: string;
  topic: string;
  category: string;
  imageUrl: string;
  imageAlt: string;
  editions: AiInsiderEdition[];
};

const aiInsiderFeed = feed as AiInsiderFeed;

function editionPayload(edition: AiInsiderEdition) {
  const imageUrl = edition.imageUrl?.trim() || aiInsiderFeed.imageUrl;
  const imageAlt = edition.imageAlt?.trim() || aiInsiderFeed.imageAlt;
  return {
    title: edition.title,
    summary: edition.summary,
    author: aiInsiderFeed.author,
    publishedAt: edition.publishedAt,
    seoTitle: edition.title,
    seoDescription: edition.summary,
    imageUrl,
    imageAlt,
    category: aiInsiderFeed.category,
    relatedSlugs: [] as string[],
    blocks: [
      {
        type: "paragraph" as const,
        text: `${edition.summary} Leia a edição completa no LinkedIn.`,
        items: [] as string[],
        href: "",
      },
    ],
    fields: { topic: aiInsiderFeed.topic },
    bannerTargets: [] as unknown[],
    downloadUrl: "",
    sourceUrl: edition.sourceUrl,
    validationNote: "",
  };
}

export function aiInsiderPublishedDocuments(idOffset: number) {
  return aiInsiderFeed.editions.map((edition, index) => ({
    id: idOffset + index + 1,
    key: `news:${edition.slug}`,
    kind: "news" as const,
    locale: "pt-BR" as const,
    slug: edition.slug,
    payload: editionPayload(edition),
  }));
}

export function getAiInsiderFeed(): AiInsiderFeed {
  return aiInsiderFeed;
}
