import { CMS_LOCALES, type CmsLocale } from "./cms";

export type SiteLocale = CmsLocale;

export const DEFAULT_LOCALE: SiteLocale = "pt-BR";

export const LOCALE_STORAGE_KEY = "onsmart-locale";

export const LOCALE_SHORT: Record<SiteLocale, string> = {
  "pt-BR": "PT",
  en: "EN",
  es: "ES",
};

export const LOCALE_NAMES: Record<SiteLocale, string> = {
  "pt-BR": "Português",
  en: "English",
  es: "Español",
};

export function isSiteLocale(value: string): value is SiteLocale {
  return (CMS_LOCALES as readonly string[]).includes(value);
}

export function readStoredLocale(): SiteLocale {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (stored && isSiteLocale(stored)) return stored;
  } catch {
    /* storage blocked */
  }
  return DEFAULT_LOCALE;
}

export function localeToHtmlLang(locale: SiteLocale): string {
  if (locale === "pt-BR") return "pt-BR";
  return locale;
}
