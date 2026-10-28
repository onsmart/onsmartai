import type { SiteLocale } from "@shared/locale";

export type ElevenLabsAgentLanguage = "en" | "es" | "pt-br";

export function elevenLabsLanguage(locale: SiteLocale): ElevenLabsAgentLanguage {
  if (locale === "en") return "en";
  if (locale === "es") return "es";
  return "pt-br";
}
