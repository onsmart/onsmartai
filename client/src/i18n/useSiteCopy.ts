import { useMemo } from "react";
import { DEFAULT_LOCALE, type SiteLocale } from "@shared/locale";
import { useLocale } from "./LocaleProvider";
import { SITE_COPY, type SiteCopy } from "./site-copy";

type Path = string;

function getByPath(obj: unknown, path: Path): string | undefined {
  const parts = path.split(".");
  let cur: unknown = obj;
  for (const part of parts) {
    if (cur === null || cur === typeof undefined || typeof cur !== "object")
      return undefined;
    cur = (cur as Record<string, unknown>)[part];
  }
  return typeof cur === "string" ? cur : undefined;
}

export function translatePath(
  locale: SiteLocale,
  path: Path,
  params?: Record<string, string>
): string {
  const table = SITE_COPY[locale] ?? SITE_COPY[DEFAULT_LOCALE];
  let value =
    getByPath(table, path) ?? getByPath(SITE_COPY[DEFAULT_LOCALE], path) ?? path;
  if (params) {
    for (const [key, replacement] of Object.entries(params)) {
      value = value.replaceAll(`{${key}}`, replacement);
    }
  }
  return value;
}

export function useSiteCopy() {
  const { locale } = useLocale();
  const t = useMemo(
    () => (path: Path, params?: Record<string, string>) =>
      translatePath(locale, path, params),
    [locale]
  );
  return { t, locale, copy: SITE_COPY[locale] ?? SITE_COPY[DEFAULT_LOCALE] };
}

export type { SiteCopy };
