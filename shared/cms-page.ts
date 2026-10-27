import type { PublishedDocument } from "./cms";
import type { SiteLocale } from "./locale";

/** Page document for route key, preferring active locale then pt-BR. */
export function resolveCmsPageDocument(
  documents: PublishedDocument[],
  key: string,
  locale: SiteLocale
): PublishedDocument | undefined {
  return (
    documents.find(doc => doc.key === key && doc.locale === locale) ??
    (locale !== "pt-BR"
      ? documents.find(doc => doc.key === key && doc.locale === "pt-BR")
      : undefined)
  );
}

export function cmsPageIsAvailable(
  documents: PublishedDocument[],
  key: string,
  locale: SiteLocale
): boolean {
  return Boolean(resolveCmsPageDocument(documents, key, locale));
}
