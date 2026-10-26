import type { SiteLocale } from "@shared/locale";
import en from "./cms-fallback.en.json";
import es from "./cms-fallback.es.json";

const TABLES: Partial<Record<SiteLocale, Record<string, string>>> = {
  en: en as Record<string, string>,
  es: es as Record<string, string>,
};

/** CMS copy when no published document exists for the active locale. */
export function cmsLocaleFallback(
  original: string,
  resolvedFromPt: string,
  locale: SiteLocale
): string {
  if (locale === "pt-BR") return resolvedFromPt;
  const table = TABLES[locale];
  if (!table) return resolvedFromPt;
  return table[original] ?? table[resolvedFromPt] ?? resolvedFromPt;
}
